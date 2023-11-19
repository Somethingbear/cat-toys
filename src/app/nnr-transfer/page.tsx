"use client";

import { Button, Input, QRCode, Tooltip, message, Image } from "antd";
import React, { useMemo, useState } from "react";
import copy from "copy-to-clipboard";
import { CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
// import Image from "next/image";

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
  const [showImage, setShowImage] = useState(0);

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
      <h2>
        <Link href={"https://nnr.moe"} target="_blank" className=" underline text-blue-500">
          NNR
        </Link>{" "}
        Transfer
      </h2>

      <section>
        <span className="flex items-center gap-4">
          Paste Original vmess Here
          <InfoCircleOutlined
            onClick={() => {
              setShowImage(1);
            }}
          />
        </span>
        <Input
          value={originalVmessStr}
          onChange={(e) => {
            setOriginalVmessStr(e.target.value);
          }}
        />
      </section>
      <section>
        <span className="flex items-center gap-4">
          Copy to NNR Host:
          <InfoCircleOutlined
            onClick={() => {
              setShowImage(2);
            }}
          />
        </span>
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
        <span className="flex items-center gap-4">
          Copy to NNR Port:
          <InfoCircleOutlined
            onClick={() => {
              setShowImage(2);
            }}
          />
        </span>
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
        <span className="flex items-center gap-4">
          {`Paste "HOST:PORT" from NNR`}
          <InfoCircleOutlined
            onClick={() => {
              setShowImage(3);
            }}
          />
        </span>
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
      <section>{newVmessStr && <QRCode value={newVmessStr} />}</section>
      <section>
        <Image
          src={`/images/nnr-transfer/${showImage}.png`}
          width={200}
          preview={{
            visible: showImage > 0,
            onVisibleChange: (value) => {
              if (!value) {
                setShowImage(0);
              }
            },
          }}
          alt=""
          className="hidden"

          // style={{ display: "none" }}
        />
      </section>
    </main>
  );
};

export default NNRTransfer;
