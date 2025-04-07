"use client";

import { Button, Input, QRCode, Table, TableProps } from "antd";
import { useMemo, useState } from "react";
import copy from "copy-to-clipboard";

const CommaTool = () => {
  const [originalStr, setOriginalStr] = useState<string>("");

  const transferStr = useMemo(() => {
    const strArr = originalStr.split("\n").filter(Boolean);
    return strArr.join(",");
  }, [originalStr]);

  return (
    <main className="flex max-w-[1300px] flex-col gap-4 p-6">
      <h2 className="print:hidden">Comma Tool</h2>

      <section className="print:hidden">
        <span className="flex items-center gap-4">
          <span>{`Copy&Paste Original Here`}</span>
        </span>
        <Input.TextArea
          value={originalStr}
          onChange={(e) => {
            setOriginalStr(e.target.value);
          }}
        />
      </section>

      <section>
        <Input.TextArea value={transferStr} />
        <Button onClick={() => copy(transferStr)}>Copy</Button>
      </section>
    </main>
  );
};

export default CommaTool;
