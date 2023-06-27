import WebViewer, { getInstance } from "@pdftron/pdfjs-express-viewer";
import React from "react";

export const PDFS = [
  "/src/pdfs/A.pdf",
  "/src/pdfs/B.pdf",
  "/src/pdfs/C.pdf",
  "/src/pdfs/D.pdf",
  "/src/pdfs/E.pdf",
  "/src/pdfs/F.pdf",
  "/src/pdfs/G.pdf",
  "/src/pdfs/H.pdf",
];

export type LocRef = {
  ref: React.RefObject<HTMLDivElement>;
  index: string;
  data: {
    x: number;
    y: number;
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
    zIndex: number;
  };
};

export const WebViewerContext = React.createContext<{
  instance?: WebViewerInstance;
  setInstance?: (instance: WebViewerInstance) => void;
  locRefs?: LocRef[];
  setLocRefs?: React.Dispatch<React.SetStateAction<LocRef[]>>;
}>({});

interface Props {
  index: number;
}

export default function PDFViewer({ index }: Props): JSX.Element {
  const viewer = React.useRef(null);
  const [instance, setInstance] = React.useState(null);

  const currentViewer = viewer.current;

  console.log({ index });

  const setupInstance = React.useCallback(async () => {
    WebViewer(
      {
        path: "public/webviewer",
        initialDoc: PDFS[index],
        disableLogs: true,
        licenseKey: "FE9249dEsSIMTNnvALwC",
      },
      viewer.current
    ).then((instance: WebViewerInstance) => {
      setInstance(instance);

      const { documentViewer } = instance.Core;

      documentViewer.addEventListener("documentLoaded", () => {
        instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
      });
    });
  }, [index]);

  React.useEffect(() => {
    return () => {
      if (!instance) {
        return;
      }

      // Ideally it would be closed on unmount, but we cant await things here.
      // instance.UI.closeDocument()
      // instance.UI.dispose()
      // instance.Core.documentViewer.dispose()
    };
  }, [instance, currentViewer]);

  const handleindexChange = React.useCallback(async () => {
    const instance = getInstance();

    if (instance) {
      instance.UI.closeDocument();
      await instance.UI.dispose();
      await instance.Core.documentViewer.dispose();
    }

    setupInstance();
  }, [setupInstance]);

  React.useEffect(() => {
    handleindexChange();
  }, [index]);

  return React.useMemo(() => {
    return (
      <div className="webviewer" style={{ height: "100%" }} ref={viewer}></div>
    );
  }, []);
}
