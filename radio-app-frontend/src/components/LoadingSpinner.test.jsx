import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "./LoadingSpinner";
import { LoadingFail } from "./LoadingSpinner";

const someText = "WOOOOOOOOW";
const someOtherText = "Bitte warten...";

describe("LoadingSpinner", () => {
  it("renders spinner without text and children", () => {
    render(<LoadingSpinner />);

    const loadingSpinners = document.querySelectorAll(".loading-spinner");
    expect(loadingSpinners).toHaveLength(1);
  });

  it("renders spinner with custom text", () => {
    render(<LoadingSpinner text={someText} />);

    expect(screen.getByText(someText)).toBeInTheDocument();
  });

  it("renders spinner with className and text", () => {
    render(
      <LoadingSpinner text={someOtherText} className="font-bold text-error" />,
    );

    const text = screen.getByText(someOtherText);
    expect(text).toHaveClass("font-bold", "text-error");
  });

  it("renders children", () => {
    const childContent = <div data-testid="child">Zusatzinfo</div>;
    render(<LoadingSpinner>{childContent}</LoadingSpinner>);

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders with text and children and props", () => {
    const childContent = <span>Fortschritt: 50%</span>;
    render(
      <LoadingSpinner data-testid="testidid" text="Daten werden geladen...">
        {childContent}
      </LoadingSpinner>,
    );

    expect(screen.getByTestId("testidid")).toBeInTheDocument();
    expect(screen.getByText("Daten werden geladen...")).toBeInTheDocument();
    expect(screen.getByText("Fortschritt: 50%")).toBeInTheDocument();
  });
});

describe("LoadingFail", () => {
  it("renders without text and children (container only)", () => {
    render(<LoadingFail />);

    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it("renders with text", () => {
    const someLocalText = "Hoppla, etwas ist schiefgelaufen!";
    render(<LoadingFail text={someLocalText} />);

    expect(screen.getByText(someLocalText)).toBeInTheDocument();
  });

  it("renders children", () => {
    const childContent = <button data-testid="retry-btn">Wiederholen</button>;
    render(<LoadingFail>{childContent}</LoadingFail>);

    expect(screen.getByTestId("retry-btn")).toBeInTheDocument();
  });

  it("renders with props and classNames", () => {
    const testId = "miau4";
    render(
      <LoadingFail
        data-testid={testId}
        text="Netzwerkfehler"
        className="extra-class booom"
      />,
    );

    const container = screen.getByTestId(testId);
    expect(container).toHaveClass("extra-class", "booom");
    expect(screen.getByText("Netzwerkfehler")).toBeInTheDocument();
  });

  it("renders with text + children", () => {
    const childContent = (
      <span data-testid="detail">Server nicht erreichbar</span>
    );
    render(
      <LoadingFail text="Laden fehlgeschlagen!">{childContent}</LoadingFail>,
    );

    expect(screen.getByText("Laden fehlgeschlagen!")).toBeInTheDocument();
    expect(screen.getByText("Server nicht erreichbar")).toBeInTheDocument();
  });
});
