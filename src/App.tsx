import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export interface Question {
  id: string;
  text: string;
  choices: string[];
  correctAnswer: number;
  complexity: number;
  chapter: number;
  page: number;
  explanation: string;
  reference?: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editData, setEditData] = useState<Question | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch data from JSON Server
  useEffect(() => {
    fetch("http://localhost:3001/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  // Handle Modal Open/Close
  const handleEdit = (row: GridRowModel) => {
    setEditData(row as Question);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  // Save Edited Data
  const handleSave = () => {
    if (editData) {
      fetch(`http://localhost:3001/questions/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      }).then(() => {
        setQuestions((prev) =>
          prev.map((q) => (q.id === editData.id ? editData : q))
        );
        handleClose();
      });
    }
  };

  // Columns Definition
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "text", headerName: "Question Text", width: 500 },
    { field: "complexity", headerName: "Complexity", width: 100 },
    { field: "correctAnswer", headerName: "Correct Answer", width: 150 },
    { field: "chapter", headerName: "Chapter", width: 100 },
    { field: "page", headerName: "Page", width: 100 },
    { field: "reference", headerName: "Reference", width: 500 },
    { field: "explanation", headerName: "Explanation", width: 500 },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Questions</h1>
      <DataGrid
        style={{ height: "100%", width: "100%", marginTop: 20 }}
        rows={questions}
        columns={columns}
        getRowId={(row) => row.id}
      />

      {editData && (
        <Dialog open={open} onClose={handleClose} maxWidth="xl">
          <DialogTitle>Edit Question</DialogTitle>
          <DialogContent>
            <TextField
              label="Question Text"
              fullWidth
              margin="normal"
              value={editData.text}
              onChange={(e) =>
                setEditData({ ...editData, text: e.target.value })
              }
            />
            <TextField
              label="Explanation"
              fullWidth
              margin="normal"
              value={editData.explanation}
              onChange={(e) =>
                setEditData({ ...editData, explanation: e.target.value })
              }
            />
            <TextField
              label="Reference"
              fullWidth
              margin="normal"
              value={editData.reference}
              onChange={(e) =>
                setEditData({ ...editData, reference: e.target.value })
              }
            />

            <div>
              <h4>Choices</h4>
              {editData.choices.map((choice, index) => (
                <TextField
                  key={index}
                  label={`Choice ${index + 1}`}
                  fullWidth
                  margin="dense"
                  value={choice}
                  onChange={(e) => {
                    const updatedChoices = [...editData.choices];
                    updatedChoices[index] = e.target.value;
                    setEditData({ ...editData, choices: updatedChoices });
                  }}
                />
              ))}
              {/* <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setEditData({
                    ...editData,
                    choices: [...editData.choices, ""],
                  });
                }}
                style={{ marginTop: "10px" }}>
                Add Choice
              </Button> */}
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <TextField
                label="Chapter"
                type="number"
                value={editData.chapter}
                onChange={(e) =>
                  setEditData({ ...editData, chapter: +e.target.value })
                }
                style={{ flex: 1 }}
              />
              <TextField
                label="Page"
                type="number"
                value={editData.page}
                onChange={(e) =>
                  setEditData({ ...editData, page: +e.target.value })
                }
                style={{ flex: 1 }}
              />
              <TextField
                label="Complexity"
                type="number"
                value={editData.complexity}
                onChange={(e) =>
                  setEditData({ ...editData, complexity: +e.target.value })
                }
                style={{ flex: 1 }}
              />
              <TextField
                label="Correct Answer"
                type="number"
                value={editData.correctAnswer}
                onChange={(e) =>
                  setEditData({ ...editData, correctAnswer: +e.target.value })
                }
                style={{ flex: 1 }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default App;
