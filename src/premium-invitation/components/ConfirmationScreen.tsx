import React from "react";

export function ConfirmationScreen({
    title,
    body,
    canEdit,
    editLabel,
    onEdit,
    deadlinePassedText,
    summary,
}: {
    title: string;
    body: string;
    canEdit: boolean;
    editLabel: string;
    onEdit: () => void;
    deadlinePassedText: string;
    summary: React.ReactNode;
}) {
    return (
        <div className="bg-white/75 backdrop-blur border border-black/10 shadow-sm rounded-2xl p-6">
            <div className="text-xs tracking-[0.35em] text-black/60">
                {title.toUpperCase()}
            </div>

            <div className="mt-2 text-sm text-black/75">{body}</div>

            <div className="mt-4">{summary}</div>

            <div className="mt-6">
                {canEdit ? (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="w-full px-4 py-3 rounded-xl text-sm border border-black/10 bg-black text-white"
                    >
                        {editLabel}
                    </button>
                ) : (
                    <div className="text-sm text-black/60">{deadlinePassedText}</div>
                )}
            </div>
        </div>
    );
}
