import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import { useAppStore } from '../store/appStore';
import './Editor.css';

function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const buttons = [
    { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { label: 'U', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { label: 'S', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'H3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { label: '•', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { label: '1.', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { label: '☐', action: () => editor.chain().focus().toggleTaskList().run(), active: editor.isActive('taskList') },
    { label: '""', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { label: '</>', action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
    { label: '—', action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
  ];

  return (
    <div className="editor-toolbar">
      {buttons.map((btn, i) => (
        <button
          key={i}
          className={`toolbar-btn ${btn.active ? 'active' : ''}`}
          onClick={btn.action}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

function Editor({ pageId }: { pageId: string }) {
  const { getPage, updatePage } = useAppStore();
  const page = getPage(pageId);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type \'/\' for commands...',
      }),
      Underline,
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Typography,
    ],
    content: page?.content || '<p></p>',
    onUpdate: ({ editor }) => {
      updatePage(pageId, { content: editor.getJSON() });
    },
  });

  if (!page) return null;

  return (
    <div className="editor-container">
      <div className="page-header">
        <span className="page-header-icon">{page.icon}</span>
        <h1 className="page-header-title">{page.title}</h1>
      </div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;
