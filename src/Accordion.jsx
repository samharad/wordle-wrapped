import {useState} from "react";

export default function Accordion({ whenOpenButton, whenClosedButton, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>{isOpen ? whenOpenButton(setIsOpen) : whenClosedButton(setIsOpen)}</div>
      <div>{isOpen && content}</div>
    </div>
  );
}