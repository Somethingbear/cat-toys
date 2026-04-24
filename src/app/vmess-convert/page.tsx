"use client";

import { base64Decode } from "@/utils/base64";
import { Button, Input, QRCode, Table, TableProps } from "antd";
import { useMemo, useState } from "react";
import copy from "copy-to-clipboard";

const CommaTool = () => {
  const [originalStr, setOriginalStr] = useState<string>("");

  const transferStr = useMemo(() => {
    const strArr = originalStr.split("\n").filter(Boolean);
    const convertStrArr = strArr.map((value) => {
      try {
        const vmessJson = JSON.parse(base64Decode(value.split("://")[1]));
        const { ps, add, port, id, aid, scy } = vmessJson;
        return `${ps}\n${add}|${port}|${id}|${aid}|${scy}`;
      } catch (error) {
        return "";
      }
    });
    return convertStrArr.join("\n");
  }, [originalStr]);

  return (
    <main className="flex max-w-[1300px] flex-col gap-4 p-6">
      <h2 className="print:hidden">Vmess Tansfer</h2>

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
