import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const buttons = [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), title: 'Bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), title: 'Italic' },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), title: 'Strike' },
        { type: 'separator' },
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), title: 'Bullet List' },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), title: 'Ordered List' },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), title: 'Quote' },
        { type: 'separator' },
        { icon: Undo, action: () => editor.chain().focus().undo().run(), title: 'Undo' },
        { icon: Redo, action: () => editor.chain().focus().redo().run(), title: 'Redo' },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50/50">
            {buttons.map((btn, idx) => (
                btn.type === 'separator' ? (
                    <div key={idx} className="w-px h-6 bg-slate-300 mx-1 self-center" />
                ) : (
                    <button
                        key={idx}
                        onClick={btn.action}
                        title={btn.title}
                        className={`
              p-1.5 rounded-md transition-colors
              ${btn.isActive ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-200'}
            `}
                        type="button"
                    >
                        <btn.icon size={16} />
                    </button>
                )
            ))}
        </div>
    );
};

const RichTextEditor = ({ value, onChange, className = '' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange && onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none min-h-[150px] p-4 max-w-none text-slate-700',
            },
        },
    });

    return (
        <div className={`border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all ${className}`}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;
