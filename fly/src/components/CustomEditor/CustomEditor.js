'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './CustomEditor.module.scss';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
);

const DEFAULT_OPTIONS = [
    'inline', 'blockType', 'fontSize', 'list',
    'textAlign', 'colorPicker', 'link', 'emoji',
    'remove', 'history', 'image'
];

const CustomEditor = ({ onChange, name, section, title, value, options = DEFAULT_OPTIONS }) => {
    const [editorState, setEditorState] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [draftModules, setDraftModules] = useState(null);

    useEffect(() => {
        Promise.all([
            import('draft-js'),
            import('draftjs-to-html'),
            import('html-to-draftjs'),
            import('react-draft-wysiwyg/dist/react-draft-wysiwyg.css'),
        ]).then(([draftJs, draftToHtmlMod, htmlToDraftMod]) => {
            setDraftModules({
                EditorState: draftJs.EditorState,
                convertToRaw: draftJs.convertToRaw,
                ContentState: draftJs.ContentState,
                draftToHtml: draftToHtmlMod.default,
                htmlToDraft: htmlToDraftMod.default,
            });
            setEditorState(draftJs.EditorState.createEmpty());
        });
    }, []);

    useEffect(() => {
        if (value && !initialized && draftModules) {
            const contentBlock = draftModules.htmlToDraft(value);
            if (contentBlock) {
                const contentState = draftModules.ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const newEditorState = draftModules.EditorState.createWithContent(contentState);
                setEditorState(newEditorState);
                setInitialized(true);
            }
        }
    }, [value, initialized, draftModules]);

    const handleEditorChange = (state) => {
        setEditorState(state);
        if (draftModules) {
            const html = draftModules.draftToHtml(draftModules.convertToRaw(state.getCurrentContent()));
            onChange(section, name, html);
        }
    };

    const uploadImageCallBack = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({ data: { link: reader.result } });
            };
            reader.readAsDataURL(file);
        });
    };

    if (!editorState || !draftModules) {
        return (
            <div className={styles.customeditor}>
                <p className={styles.customeditor__title}>{title}</p>
            </div>
        );
    }

    return (
        <div className={styles.customeditor}>
            <p className={styles.customeditor__title}>{title}</p>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={{
                    options,
                    image: {
                        uploadEnabled: true,
                        uploadCallback: uploadImageCallBack,
                        previewImage: true,
                        alt: { present: true, mandatory: false },
                    },
                }}
                wrapperClassName={styles.customeditor__wrap}
                editorClassName={styles.customeditor__input}
            />
        </div>
    );
};

export default CustomEditor;
