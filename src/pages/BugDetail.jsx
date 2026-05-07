import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const BugDetail = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBug = useCallback(() => {
    return axiosInstance.get(`/bugs/${id}`)
      .then(res => setBug(res.data.data));
  }, [id]);

  const fetchComments = useCallback(() => {
    return axiosInstance.get(`/comments/bug/${id}`)
      .then(res => setComments(res.data.data || []));
  }, [id]);

  useEffect(() => {
    Promise.all([fetchBug(), fetchComments()])
      .finally(() => setLoading(false));
  }, [fetchBug, fetchComments]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.patch(`/bugs/${id}/status?status=${newStatus}`);
      fetchBug();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axiosInstance.post('/comments', {
        content: comment,
        bugId: parseInt(id)
      });
      setComment('');
      fetchComments();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!bug) return <div style={styles.loading}>Bug not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{bug.title}</h1>
          <div style={styles.badges}>
            <span style={{...styles.badge, backgroundColor: '#dbeafe'}}>
              {bug.status}
            </span>
            <span style={{...styles.badge, backgroundColor: '#fee2e2'}}>
              {bug.priority}
            </span>
          </div>
        </div>
        <p style={styles.desc}>{bug.description}</p>
        <div style={styles.meta}>
          <span>Project: <b>{bug.projectName}</b></span>
          <span>Reporter: <b>{bug.reportedByName}</b></span>
          <span>Assigned: <b>{bug.assignedToName}</b></span>
        </div>
        {(user?.role === 'DEVELOPER' || user?.role === 'ADMIN') && (
          <div style={styles.statusSection}>
            <label style={styles.label}>Update Status:</label>
            <select style={styles.select} value={bug.status}
              onChange={e => handleStatusChange(e.target.value)}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}
      </div>

      <div style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>
          Comments ({comments.length})
        </h2>
        <form onSubmit={handleComment} style={styles.commentForm}>
          <textarea style={styles.textarea}
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)} />
          <button style={styles.btn} type="submit">
            Post Comment
          </button>
        </form>
        {comments.map(c => (
          <div key={c.id} style={styles.comment}>
            <p style={styles.commentContent}>{c.content}</p>
            <span style={styles.commentMeta}>
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  title: { fontSize: '22px', color: '#1e293b', flex: 1 },
  badges: { display: 'flex', gap: '8px' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  desc: { color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' },
  meta: { display: 'flex', gap: '24px', color: '#64748b', fontSize: '13px', marginBottom: '16px' },
  statusSection: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' },
  label: { fontSize: '14px', color: '#374151', fontWeight: '500' },
  select: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' },
  commentsSection: { backgroundColor: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  commentsTitle: { fontSize: '18px', color: '#1e293b', marginBottom: '16px' },
  commentForm: { marginBottom: '20px' },
  textarea: { display: 'block', width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', minHeight: '80px' },
  btn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  comment: { padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '10px' },
  commentContent: { color: '#374151', fontSize: '14px', marginBottom: '6px' },
  commentMeta: { color: '#94a3b8', fontSize: '12px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
};

export default BugDetail;