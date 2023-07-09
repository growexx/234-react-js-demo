import { fireEvent, getByText, render, screen } from "@testing-library/react";
import PopUp from "../PopUp";
import { popup } from "./mock";

const handleEvent = jest.fn();

describe("Popup Component", () => {
  const popupComponent = (
    <PopUp
      buttonName={popup.buttonName}
      buttonColor={popup.buttonColor}
      buttonIcon={popup.buttonIcon}
      note={popup.note}
      handleEvent={handleEvent}
    />
  );

  beforeEach(() => {
    render(popupComponent);
  });

  it("renders button with correct details", () => {
    const popupElement = screen.getByRole("button", popup.buttonName);
    expect(popupElement).toBeInTheDocument();
    expect(popupElement).toHaveClass(
      "MuiButton-root",
      "MuiButton-variantOutlined",
      "MuiButton-colorDanger",
    );
  });

  it("should open the model on button click event", () => {
    const button = screen.getByRole("button", { name: popup.buttonName });
    fireEvent.click(button);

    const modal = screen.getByRole("alertdialog");
    expect(modal).toBeInTheDocument();
  });

  it("should display the confirmation message correctly in the modal", () => {
    const button = screen.getByRole("button", { name: popup.buttonName });
    fireEvent.click(button);

    const confirmationTitle = screen.getByRole("heading", {
      level: 2,
      name: /confirmation/i,
    });
    expect(confirmationTitle).toBeInTheDocument();
    expect(confirmationTitle).toHaveTextContent("Confirmation");

    const confirmationDescription = screen.getByText(popup.note);
    expect(confirmationDescription).toBeInTheDocument();
    expect(confirmationDescription).toHaveTextContent(popup.note);
    expect(confirmationDescription).toHaveStyle(
      "color: MuiTypography-colorTextTertiary",
    );
  });

  it("should call the handleEvent function when clicking the discard button of the modal", () => {
    const button = screen.getByRole("button", { name: popup.buttonName });
    fireEvent.click(button);

    const discardButton = screen.getByRole("button", {
      name: popup.buttonName,
    });
    fireEvent.click(discardButton);

    expect(handleEvent).toHaveBeenCalled();
  });

  it("should close the modal when clicking the cancel button", () => {
    const button = screen.getByRole("button", { name: popup.buttonName });
    fireEvent.click(button);

    const modal = screen.getByRole("alertdialog");
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });

    fireEvent.click(cancelButton);
    expect(modal).not.toBeInTheDocument();
  });
});
