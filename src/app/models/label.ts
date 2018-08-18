export interface Label {
  id: string;
  idBoard: string;
  name: string;
  color: string;
}


// Since the calendar acts global, this is a label variant ignoring the id/boardId
export interface GlobalLabel {
  name: string;


  // same order is guaranteed. Maybe better to just push all labels? ...
  ids: string[];
  idBoards: string[];
  colors: string[];
}
