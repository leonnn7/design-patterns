// State Pattern Implementation

interface EditorState {
  onInput(editor: Editor): void;
  onSave(editor: Editor): void;
  onSaveAs(editor: Editor): void;
  onNew(editor: Editor): void;
  onFileClick(editor: Editor, file: string): void;
  getLabel(): string;
}

class Editor {
  public textArea: HTMLTextAreaElement;
  public state: EditorState;
  public openFile: string | undefined;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
    this.state = new CleanUnsavedState();
    this.openFile = undefined;
    this.setStateLabel();
  }

  setState(state: EditorState) {
    this.state = state;
    this.setStateLabel();
  }

  setStateLabel() {
    setStateLabel(this.state.getLabel());
  }
}

class CleanUnsavedState implements EditorState {
  onInput(editor: Editor): void {
    editor.setState(new DirtyUnsavedState());
  }
  onSave(editor: Editor): void {
    editor.state.onSaveAs(editor);
  }
  onSaveAs(editor: Editor): void {
    const content = editor.textArea.value;
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() != "") {
      if (!filename.endsWith(".txt")) {
        filename = filename + ".txt";
      }
      localStorage.setItem(filename, content);
      editor.openFile = filename;
      editor.setState(new CleanSavedState(filename));
      showFiles(listFiles(), "files-list");
    }
  }
  onNew(editor: Editor): void {
    editor.textArea.value = "";
    editor.openFile = undefined;
    editor.setState(new CleanUnsavedState());
  }
  onFileClick(editor: Editor, file: string): void {
    const content = localStorage.getItem(file);
    editor.openFile = file;
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(file));
  }
  getLabel(): string {
    return "*";
  }
}

class CleanSavedState implements EditorState {
  constructor(private filename: string) {}
  onInput(editor: Editor): void {
    editor.setState(new DirtySavedState(this.filename));
  }
  onSave(editor: Editor): void {
    const content = editor.textArea.value;
    localStorage.setItem(this.filename, content);
    editor.setState(new CleanSavedState(this.filename));
    showFiles(listFiles(), "files-list");
  }
  onSaveAs(editor: Editor): void {
    const content = editor.textArea.value;
    let filename = prompt("Enter a File Name", this.filename);
    if (filename && filename.trim() != "") {
      if (!filename.endsWith(".txt")) {
        filename = filename + ".txt";
      }
      localStorage.setItem(filename, content);
      editor.openFile = filename;
      editor.setState(new CleanSavedState(filename));
      showFiles(listFiles(), "files-list");
    }
  }
  onNew(editor: Editor): void {
    editor.textArea.value = "";
    editor.openFile = undefined;
    editor.setState(new CleanUnsavedState());
  }
  onFileClick(editor: Editor, file: string): void {
    const content = localStorage.getItem(file);
    editor.openFile = file;
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(file));
  }
  getLabel(): string {
    return this.filename;
  }
}

class DirtyUnsavedState implements EditorState {
  onInput(editor: Editor): void {
    // bleibt im selben Zustand
  }
  onSave(editor: Editor): void {
    this.onSaveAs(editor);
  }
  onSaveAs(editor: Editor): void {
    const content = editor.textArea.value;
    let filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() != "") {
      if (!filename.endsWith(".txt")) {
        filename = filename + ".txt";
      }
      localStorage.setItem(filename, content);
      editor.openFile = filename;
      editor.setState(new CleanSavedState(filename));
      showFiles(listFiles(), "files-list");
    }
  }
  onNew(editor: Editor): void {
    editor.textArea.value = "";
    editor.openFile = undefined;
    editor.setState(new CleanUnsavedState());
  }
  onFileClick(editor: Editor, file: string): void {
    const content = localStorage.getItem(file);
    editor.openFile = file;
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(file));
  }
  getLabel(): string {
    return "*";
  }
}

class DirtySavedState implements EditorState {
  constructor(private filename: string) {}
  onInput(editor: Editor): void {
    // bleibt im selben Zustand
  }
  onSave(editor: Editor): void {
    const content = editor.textArea.value;
    localStorage.setItem(this.filename, content);
    editor.setState(new CleanSavedState(this.filename));
    showFiles(listFiles(), "files-list");
  }
  onSaveAs(editor: Editor): void {
    const content = editor.textArea.value;
    let filename = prompt("Enter a File Name", this.filename);
    if (filename && filename.trim() != "") {
      if (!filename.endsWith(".txt")) {
        filename = filename + ".txt";
      }
      localStorage.setItem(filename, content);
      editor.openFile = filename;
      editor.setState(new CleanSavedState(filename));
      showFiles(listFiles(), "files-list");
    }
  }
  onNew(editor: Editor): void {
    editor.textArea.value = "";
    editor.openFile = undefined;
    editor.setState(new CleanUnsavedState());
  }
  onFileClick(editor: Editor, file: string): void {
    const content = localStorage.getItem(file);
    editor.openFile = file;
    editor.textArea.value = content;
    editor.setState(new CleanSavedState(file));
  }
  getLabel(): string {
    return this.filename + " *";
  }
}

// Initialisierung und Event-Handler

document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("text") as HTMLTextAreaElement;
  const editor = new Editor(textArea);
  showFiles(listFiles(), "files-list");

  textArea.addEventListener("input", () => {
    editor.state.onInput(editor);
    editor.setStateLabel();
  });
  const saveAsButton = document.getElementById("save-as-button");
  saveAsButton.addEventListener("click", () => {
    editor.state.onSaveAs(editor);
    editor.setStateLabel();
  });
  const saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", () => {
    editor.state.onSave(editor);
    editor.setStateLabel();
  });
  const newButton = document.getElementById("new-button");
  newButton.addEventListener("click", () => {
    editor.state.onNew(editor);
    editor.setStateLabel();
  });
  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?" );
    event.preventDefault();
    return false;
  });
  // File-Click-Handler
  const parent = document.getElementById("files-list");
  parent.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "A") {
      const file = target.innerHTML;
      editor.state.onFileClick(editor, file);
      editor.setStateLabel();
    }
  });
});

function setStateLabel(value: string) {
  const stateLabel = document.getElementById("state-label");
  stateLabel.innerText = value;
}

function showFiles(files: string[], parentId: string) {
  const parent = document.getElementById(parentId);
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
  for (const file of files) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.innerHTML = file;
    item.appendChild(link);
    parent.append(item);
  }
}

function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    files.push(localStorage.key(i));
  }
  return files;
}
