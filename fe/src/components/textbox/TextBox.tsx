import { IconButton, TextField } from "@material-ui/core";
import React, { useState } from "react";
import {
  FiberManualRecord,
  RadioButtonUnchecked,
  CheckBoxOutlineBlank,
  ArrowUpward,
} from "@material-ui/icons";
import "./TextBox.scss";
import { Note, NoteType } from "../notes/NotesApi";
import { isMobileUserAgent } from "../../utils/UserAgentUtils";

type TextBoxProps = {
  onSubmit: (note: Partial<Note>) => void;
};

const noteTypes: NoteType[] = ["note", "task", "event"];

export default function TextBox(props: TextBoxProps) {
  const [note, setNote] = useState("");
  const [noteTypeIndex, setNoteTypeIndex] = React.useState(0);
  const noteType = noteTypes[noteTypeIndex];

  const handleNoteChanged: React.TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"] = (
    event
  ) => {
    let newNote = event?.target?.value;
    setNote(newNote);
  };

  const handleToggleType = () => {
    let newNoteTypeIndex = noteTypeIndex + 1;
    if (newNoteTypeIndex >= noteTypes.length) {
      newNoteTypeIndex = 0;
    }
    setNoteTypeIndex(newNoteTypeIndex);
  };

  const handleKeyDown: React.DOMAttributes<HTMLDivElement>["onKeyDown"] = (
    event
  ) => {
    if (event.key === "Enter" && !event.shiftKey && !isMobileUserAgent()) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    props.onSubmit({
      body: note,
      type: noteTypes[noteTypeIndex],
    });

    setNote("");
  };

  return (
    <div className="textbox">
      <IconButton edge="start" size="small" onClick={handleToggleType}>
        {noteType === "note" && <FiberManualRecord />}
        {noteType === "task" && <CheckBoxOutlineBlank />}
        {noteType === "event" && <RadioButtonUnchecked />}
      </IconButton>

      <TextField
        multiline
        rowsMax={2}
        value={note}
        onKeyDown={handleKeyDown}
        onChange={handleNoteChanged}
        fullWidth
      />

      <IconButton edge="end" size="small" onClick={handleSubmit}>
        <ArrowUpward />
      </IconButton>
    </div>
  );
}
