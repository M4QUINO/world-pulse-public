import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoaderCircle, MessageSquareMore, SendHorizontal, Shield, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.trim() || '/api';

const TONE_OPTIONS = [
  { value: 'analise', label: 'Analise' },
  { value: 'concordo', label: 'Concordo' },
  { value: 'discordo', label: 'Discordo' },
  { value: 'pergunta', label: 'Pergunta' },
];

const toneClassName = (tone) => {
  switch (tone) {
    case 'concordo':
      return 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300';
    case 'discordo':
      return 'bg-rose-500/12 text-rose-700 dark:text-rose-300';
    case 'pergunta':
      return 'bg-amber-500/12 text-amber-700 dark:text-amber-300';
    default:
      return 'bg-sky-500/12 text-sky-700 dark:text-sky-300';
  }
};

const CommentThread = ({ article, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [tone, setTone] = useState('analise');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!article?.slug) {
      return undefined;
    }

    let cancelled = false;

    const loadComments = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_BASE}/comments/${article.slug}`);
        if (!cancelled) {
          setComments(response.data.comments || []);
          onCommentCountChange?.(article.slug, response.data.count || 0);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError('Nao consegui carregar os comentarios agora.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [article?.slug, onCommentCountChange]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/comments/${article.slug}`, {
        author,
        body,
        tone,
      });

      setComments((current) => [response.data.comment, ...current]);
      setBody('');
      setAuthor('');
      onCommentCountChange?.(article.slug, response.data.count || comments.length + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Nao foi possivel publicar agora.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="rounded-[1.8rem] border border-white/12 bg-slate-950/94 p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.28)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300">
            <MessageSquareMore className="h-4 w-4" />
            Debate anonimo
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Comentarios livres para contextualizar, discordar e ampliar a leitura.
          </div>
        </div>
        <div className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white">
          {comments.length} falas
        </div>
      </div>

      <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          <Shield className="h-4 w-4" />
          Postagem sem cadastro
        </div>
        <p className="text-sm leading-6 text-slate-300">
          Voce publica com apelido opcional. Se deixar em branco, o sistema gera um alias anonimo automaticamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-5 space-y-3">
        <input
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Alias opcional"
          className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
        />

        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTone(option.value)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                tone === option.value ? 'bg-white text-slate-950' : 'bg-white/8 text-slate-300 hover:bg-white/12'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={article?.debatePrompt || 'O que esta faltando nessa leitura?'}
          rows={5}
          className="w-full resize-none rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
        />

        {error ? <div className="text-sm text-amber-300">{error}</div> : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
          {submitting ? 'Publicando...' : 'Publicar comentario'}
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Carregando debate...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-white/12 px-4 py-6 text-sm leading-6 text-slate-300">
            Ainda nao ha comentarios aqui. Este espaco esta pronto para abrir a conversa.
          </div>
        ) : (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-[1.35rem] border border-white/10 bg-white/6 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-white">{comment.author}</div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${toneClassName(comment.tone)}`}>
                      {comment.tone}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-200">{comment.body}</p>

                <div className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Debate vivo
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default CommentThread;
