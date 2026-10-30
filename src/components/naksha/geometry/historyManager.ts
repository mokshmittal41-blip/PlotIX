import type { FloorPlanModel } from './types';

export class HistoryManager {
  private undoStack: FloorPlanModel[] = [];
  private redoStack: FloorPlanModel[] = [];
  private maxHistory: number = 30;

  constructor(initialState?: FloorPlanModel) {
    if (initialState) {
      this.undoStack.push(JSON.parse(JSON.stringify(initialState)));
    }
  }

  public pushState(state: FloorPlanModel) {
    const clone = JSON.parse(JSON.stringify(state));
    this.undoStack.push(clone);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Clear redo stack on new action
    this.redoStack = [];
  }

  public undo(): FloorPlanModel | null {
    if (this.undoStack.length <= 1) {
      return null;
    }
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    const previous = this.undoStack[this.undoStack.length - 1];
    return JSON.parse(JSON.stringify(previous));
  }

  public redo(): FloorPlanModel | null {
    if (this.redoStack.length === 0) {
      return null;
    }
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    return JSON.parse(JSON.stringify(next));
  }

  public get canUndo(): boolean {
    return this.undoStack.length > 1;
  }

  public get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public getCurrentState(): FloorPlanModel | null {
    if (this.undoStack.length === 0) return null;
    return JSON.parse(JSON.stringify(this.undoStack[this.undoStack.length - 1]));
  }
}
