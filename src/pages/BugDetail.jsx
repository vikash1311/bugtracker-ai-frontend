import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMessageSquare, FiSend } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme, priorityConfig, statusConfig } from '../utils/theme';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const BugDetail = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const navigate = useNavigate();

  const fetchBug = useCallback(() => {
    return axiosInstance.get(`/bugs/${id}`).then(res => setBug(res.data.data));
  }, [id]);

  const fetchComments = useCallback(() => {
    return axiosInstance.get(`/comments/bug/${id}`)
      .then(res => setComments(res.data.data || []));
  }, [id]);

  useEffect(() => {
    Promise.all([fetchBug(), fetchComments()]).finally(() => setLoading(false));
  }, [fetchBug, fetchComments]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === bug.status) return;
    setStatusUpdating(true);
    setStatusError('');
    try {
      await axiosInstance.patch(`/bugs/${id}/status?status=${newStatus}`);
      await fetchBug();
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPostingComment(true);
    setCommentError('');
    try {
      await axiosInstance.post('/comments', { content: comment, bugId: parseInt(id) });
      setComment('');
      await fetchComments();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 40, height: 40, borderRadius: '50%',
          border: `3px solid ${t.accent}`, borderTopColor: 'transparent' }} />
    </div>
  );

  if (!bug) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: t.textMuted }}>
      Bug not found.
    </div>
  );

  const statusInfo = statusConfig[bug.status] || statusConfig.OPEN;
  const priorityInfo = priorityConfig[bug.priority] || priorityConfig.LOW;
  const canUpdateStatus = user?.role === 'DEVELOPER' || user?.role === 'ADMIN';

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        whileHover={{ x: -3 }}
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: t.textSecondary, fontSize: 13, marginBottom: 16, padding: 0,
        }}>
        <FiArrowLeft size={15} /> Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: t.bgSecondary, borderRadius: 18,
          padding: 28, border: `1px solid ${t.border}`,
          boxShadow: t.cardShadow, marginBottom: 20,
        }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: 16, marginBottom: 16, flexWrap: 'wrap',
        }}>
          <h1 style={{
            fontSize: 21, fontWeight: 800, fontFamily: t.fontDisplay,
            color: t.text, margin: 0, flex: '1 1 280px', lineHeight: 1.3,
          }}>
            {bug.title}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <span style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11,
              fontWeight: 700, letterSpacing: '0.3px',
              color: priorityInfo.color, backgroundColor: priorityInfo.bg,
            }}>
              {priorityInfo.label.toUpperCase()}
            </span>
            <span style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11,
              fontWeight: 700, letterSpacing: '0.3px',
              color: statusInfo.color, backgroundColor: statusInfo.bg,
            }}>
              {statusInfo.label.toUpperCase()}
            </span>
          </div>
        </div>

        <p style={{
          color: t.textSecondary, fontSize: 14.5, lineHeight: 1.65,
          marginBottom: 20, whiteSpace: 'pre-wrap',
        }}>
          {bug.description}
        </p>

        <div style={{
          display: 'flex', gap: 24, flexWrap: 'wrap',
          paddingTop: 16, borderTop: `1px solid ${t.border}`,
          fontSize: 12.5, color: t.textMuted,
        }}>
          <span>Project: <strong style={{ color: t.textSecondary }}>{bug.projectName}</strong></span>
          <span>Reporter: <strong style={{ color: t.textSecondary }}>{bug.reportedByName}</strong></span>
          {bug.assignedToName && (
            <span>Assigned: <strong style={{ color: t.textSecondary }}>{bug.assignedToName}</strong></span>
          )}
        </div>

        {canUpdateStatus && (
          <div style={{
            marginTop: 20, paddingTop: 20, borderTop: `1px solid ${t.border}`,
          }}>
            <label style={{
              display: 'block', marginBottom: 10, fontSize: 12.5,
              fontWeight: 600, color: t.textSecondary,
            }}>
              Update status
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.map(s => {
                const info = statusConfig[s];
                const active = bug.status === s;
                return (
                  <motion.button
                    key={s}
                    whileHover={{ scale: statusUpdating ? 1 : 1.03 }}
                    whileTap={{ scale: statusUpdating ? 1 : 0.97 }}
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange(s)}
                    style={{
                      padding: '8px 14px', borderRadius: 10, fontSize: 12.5,
                      fontWeight: 600, cursor: statusUpdating ? 'default' : 'pointer',
                      border: `1.5px solid ${active ? info.color : t.border}`,
                      backgroundColor: active ? info.bg : 'transparent',
                      color: active ? info.color : t.textSecondary,
                      opacity: statusUpdating ? 0.6 : 1,
                    }}>
                    {info.label}
                  </motion.button>
                );
              })}
            </div>
            {statusError && (
              <p style={{ color: t.accent, fontSize: 12.5, marginTop: 10 }}>{statusError}</p>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          backgroundColor: t.bgSecondary, borderRadius: 18,
          padding: 28, border: `1px solid ${t.border}`,
          boxShadow: t.cardShadow,
        }}>
        <h2 style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 16, fontWeight: 700, fontFamily: t.fontDisplay,
          color: t.text, margin: '0 0 18px',
        }}>
          <FiMessageSquare size={16} color={t.textMuted} />
          Comments <span style={{ color: t.textMuted, fontWeight: 500 }}>({comments.length})</span>
        </h2>

        <form onSubmit={handleComment} style={{ marginBottom: 24 }}>
          <textarea
            placeholder="Add a comment…"
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px',
              backgroundColor: t.bgTertiary, border: `1px solid ${t.border}`,
              borderRadius: 12, color: t.text, fontSize: 13.5,
              boxSizing: 'border-box', minHeight: 80, resize: 'vertical',
              fontFamily: 'inherit', marginBottom: 10, outline: 'none',
            }} />
          {commentError && (
            <p style={{ color: t.accent, fontSize: 12.5, marginBottom: 10 }}>{commentError}</p>
          )}
          <motion.button
            whileHover={{ scale: postingComment ? 1 : 1.03 }}
            whileTap={{ scale: postingComment ? 1 : 0.97 }}
            type="submit" disabled={postingComment || !comment.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 18px',
              background: (postingComment || !comment.trim()) ? t.bgTertiary : t.accent,
              color: (postingComment || !comment.trim()) ? t.textMuted : '#0A0E14',
              border: 'none', borderRadius: 10,
              cursor: (postingComment || !comment.trim()) ? 'default' : 'pointer',
              fontSize: 13, fontWeight: 700,
            }}>
            <FiSend size={13} /> {postingComment ? 'Posting…' : 'Post Comment'}
          </motion.button>
        </form>

        {comments.length === 0 ? (
          <p style={{ color: t.textMuted, fontSize: 13.5 }}>No comments yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {comments.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  padding: '14px 16px', backgroundColor: t.bgTertiary,
                  borderRadius: 12,
                }}>
                <p style={{ color: t.text, fontSize: 13.5, lineHeight: 1.5, margin: '0 0 8px' }}>
                  {c.content}
                </p>
                <span style={{ color: t.textMuted, fontSize: 11.5 }}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BugDetail;