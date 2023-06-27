import WebViewer, { getInstance } from "@pdftron/pdfjs-express-viewer";
import React from "react";

const PDFS = [
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
  index: string;
}

export default function PDFViewer({ index }: Props): JSX.Element {
  const viewer = React.useRef(null);
  const [instance, setInstance] = React.useState(null);

  const currentViewer = viewer.current;

  console.log({ index });

  const setupInstance = React.useCallback(async () => {
    WebViewer(
      {
        path: "webviewer/A",
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

  const updateInstance = React.useCallback(async () => {
    instance.UI.loadDocument(PDFS[index], {
      documentId: index,
    });
  }, [index, instance]);

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

    console.log({ instance });

    if (instance) {
      instance.UI.closeDocument();
      await instance.UI.dispose();
      await instance.Core.documentViewer.dispose();
    }

    setupInstance();
  }, [setupInstance]);

  React.useEffect(() => {
    handleindexChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return React.useMemo(() => {
    return (
      <div className="webviewer" style={{ height: "100%" }} ref={viewer}></div>
    );
  }, []);
}
