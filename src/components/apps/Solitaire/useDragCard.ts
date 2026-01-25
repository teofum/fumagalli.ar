import type { Dispatch, ReducerAction } from "react";
import useDrag from "@/hooks/useDrag";
import type solitaireReducer from "./reducer";
import type { Card } from "./types";

export default function useDragCard(
  dispatch: Dispatch<ReducerAction<typeof solitaireReducer>>,
) {
  const onDragStart = (ev: PointerEvent, target: EventTarget | null) => {
    const el = target as HTMLElement;

    // Get drag target and all its siblings (cards on top in the stack)
    const siblings = [el];
    while (siblings.at(-1)?.nextElementSibling) {
      const next = siblings.at(-1)?.nextElementSibling as HTMLElement;
      siblings.push(next);
    }

    siblings.forEach((el) => {
      // Calculate offset from mouse (or finger)
      const { x, y } = el.getBoundingClientRect();
      const offsetX = x - ev.clientX;
      const offsetY = y - ev.clientY;

      // Save offset to DOM data attributes temporarily
      el.dataset.offsetX = offsetX.toString();
      el.dataset.offsetY = offsetY.toString();

      // Set position: fixed in element styles
      el.style.setProperty("position", "fixed");
      el.style.setProperty("top", `${y}px`);
      el.style.setProperty("left", `${x}px`);
      el.style.setProperty("z-index", "9999"); // Make sure it's on top

      // Save the transform in dataset and remove it to avoid shift
      el.dataset.transform = el.style.transform;
      el.style.removeProperty("transform");

      // Set pointer-events: none, so the drag-end event's target is whichever
      // element we happen to drop the card on top of
      el.style.setProperty("pointer-events", "none");
    });
  };

  const onDragMove = (ev: PointerEvent, target: EventTarget | null) => {
    const el = target as HTMLElement;

    // Get drag target and all its siblings (cards on top in the stack)
    const siblings = [el];
    while (siblings.at(-1)?.nextElementSibling) {
      const next = siblings.at(-1)?.nextElementSibling as HTMLElement;
      siblings.push(next);
    }

    siblings.forEach((el) => {
      // Calculate new window position from cursor + offset
      const offsetX = Number(el.dataset.offsetX || "0");
      const offsetY = Number(el.dataset.offsetY || "0");
      const newX = ev.clientX + offsetX;
      const newY = ev.clientY + offsetY;

      el.style.setProperty("top", `${~~newY}px`);
      el.style.setProperty("left", `${~~newX}px`);
    });
  };

  const onDragEnd = (ev: PointerEvent, target: EventTarget | null) => {
    const el = target as HTMLElement;

    // Get drag target and all its siblings (cards on top in the stack)
    const siblings = [el];
    while (siblings.at(-1)?.nextElementSibling) {
      const next = siblings.at(-1)?.nextElementSibling as HTMLElement;
      siblings.push(next);
    }

    siblings.forEach((el) => {
      // Drag ended, remove style attributes
      el.style.removeProperty("position");
      el.style.removeProperty("top");
      el.style.removeProperty("left");
      el.style.removeProperty("z-index");
      el.style.removeProperty("pointer-events");

      // Put the transform back
      el.style.setProperty("transform", el.dataset.transform ?? "");
      delete el.dataset.transform;

      // Reset offset data attributes
      delete el.dataset.offsetX;
      delete el.dataset.offsetY;
    });

    // Now apply the actual game logic
    // First, find out where the card was dropped
    const dropTarget = document.elementFromPoint(ev.clientX, ev.clientY);
    const dropId = dropTarget?.id;
    const parentId = dropTarget?.parentElement?.id;

    // We only care about two possibilities: a suit stack, or a row stack
    // Might be dropping on a stack directly, or on a child element
    const match =
      dropId?.match(/^stack-(suit|row)-(\d+)$/) ??
      parentId?.match(/^stack-(suit|row)-(\d+)$/);
    if (match) {
      // Figure out which card this even is
      const cards = siblings
        .map((el) => el.id.split("-"))
        .map(
          ([suit, cardNumber]) =>
            ({ suit, number: Number(cardNumber) }) as Card,
        );

      const [, type, stackNumber] = match;
      const index = Number(stackNumber);

      // Dispatch the move event
      dispatch({
        type: "move",
        cards,
        to: { type: type as "suit" | "row", index },
      });
    }
  };

  return useDrag({ onDragStart, onDragMove, onDragEnd });
}
