"use client";

import { Button, Input, message } from "antd";
import React, { useMemo, useState } from "react";
import copy from "copy-to-clipboard";
import { QRCodeSVG } from "qrcode.react";
import { CopyOutlined } from "@ant-design/icons";

const base64Encode = (str: string) => {
  return Buffer.from(str, "utf8").toString("base64");
};

const base64Decode = (str: string) => {
  return Buffer.from(str, "base64").toString("utf8");
};

const NNRTransfer = () => {
  // vmess://eyJ2IjogIjIiLCAicHMiOiAiOWNsb3VkLnZpcC0zOC4xNDMuMTguMTYyIiwgImFkZCI6ICJ1cy1zZC1oeS5oYXBweWNhdDEyLmNvbSIsICJwb3J0IjogMjU5OTcsICJpZCI6ICIzNTM2ZDlmNy1jOGJhLTQ4YTItODllMi05OTBlMmEyOGNmNDgiLCAiYWlkIjogIjAiLCAic2N5IjogImF1dG8iLCAibmV0IjogInRjcCIsICJ0eXBlIjogIm5vbmUiLCAiaG9zdCI6ICIiLCAicGF0aCI6ICIiLCAidGxzIjogIm5vbmUiLCAic25pIjogIiIsICJhbHBuIjogIiJ9
  const [originalVmessStr, setOriginalVmessStr] = useState<string>("");
  const [hostPortNNR, setHostPortNNR] = useState<string>("");

  const originalVmessJson = useMemo(() => {
    try {
      return JSON.parse(base64Decode(originalVmessStr.split("://")[1]));
    } catch (e) {
      return null;
    }
  }, [originalVmessStr]);

  const newVmessJson = useMemo(() => {
    if (!originalVmessJson) {
      return null;
    }

    const [host, port] = hostPortNNR.split(":");
    if (!host || !port) {
      return null;
    }
    return {
      ...originalVmessJson,
      add: host,
      port: port,
    };
  }, [hostPortNNR, originalVmessJson]);

  const newVmessStr = useMemo(() => {
    return newVmessJson ? `vmess://${base64Encode(JSON.stringify(newVmessJson))}` : "";
  }, [newVmessJson]);

  return (
    <main className="p-6 flex flex-col gap-4">
      <h2>NNR Transfer</h2>
      <section>
        Paste Original vmess Here
        <Input
          value={originalVmessStr}
          onChange={(e) => {
            setOriginalVmessStr(e.target.value);
          }}
        />
      </section>
      <section>
        {`Copy to NNR Host:`}
        <Input
          readOnly
          value={originalVmessJson?.add}
          disabled
          suffix={
            <CopyOutlined
              onClick={() => {
                if (!originalVmessJson.add) return;
                copy(originalVmessJson.add);
                message.success("Copied");
              }}
            />
          }
        />
      </section>
      <section>
        {`Copy to NNR Port:`}
        <Input
          readOnly
          value={originalVmessJson?.port}
          disabled
          suffix={
            <CopyOutlined
              onClick={() => {
                if (!originalVmessJson.port) return;
                copy(originalVmessJson.port);
                message.success("Copied");
              }}
            />
          }
        />
      </section>

      <section>
        {`Past "HOST:PORT" from NNR`}
        <Input
          value={hostPortNNR}
          onChange={(e) => {
            setHostPortNNR(e.target.value);
          }}
        />
      </section>

      {/* {JSON.stringify(newVmessJson)} */}

      <section>
        New Vmess:
        <Input
          value={newVmessStr}
          readOnly
          disabled
          suffix={
            <CopyOutlined
              onClick={() => {
                if (!newVmessStr) return;
                copy(newVmessStr);
                message.success("Copied");
              }}
            />
          }
        />
      </section>
      <section>{newVmessStr && <QRCodeSVG value={newVmessStr} />}</section>
    </main>
  );
};

export default NNRTransfer;
