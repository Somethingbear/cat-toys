"use client";

import { Button, Input, QRCode, Tooltip, message, Image } from "antd";
import React, { useMemo, useState } from "react";
import copy from "copy-to-clipboard";
import {
  CopyOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
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
    return newVmessJson
      ? `vmess://${base64Encode(JSON.stringify(newVmessJson))}`
      : "";
  }, [newVmessJson]);

  return (
    <main className="flex flex-col gap-4 p-6">
      <h2>
        <Link
          href={"https://nnr.moe?aff=8613"}
          target="_blank"
          className=" text-blue-500 underline"
        >
          NNR
        </Link>{" "}
        Transfer
      </h2>

      <div className="flex flex-col gap-2">
        <span
          className="underline"
          onClick={() => {
            copy("starfly.online:");
            message.success("Copied");
          }}
        >
          starfly.online
        </span>
        <span
          className="underline"
          onClick={() => {
            copy("ninestar.online:");
            message.success("Copied");
          }}
        >
          ninestar.online
        </span>
      </div>

      <section>
        <span className="flex items-center gap-4">
          <span>Copy&Paste Original Vmess Here</span>
          <span
            className="flex cursor-pointer items-center gap-[8px] text-gray-400"
            onClick={() => {
              setShowImage(1);
            }}
          >
            How
            <QuestionCircleOutlined />
          </span>
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
          <span>Copy to NNR Host:</span>
          <span
            className="flex cursor-pointer items-center gap-[8px] text-gray-400"
            onClick={() => {
              setShowImage(2);
            }}
          >
            How
            <QuestionCircleOutlined />
          </span>
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
          <span>Copy to NNR Port:</span>
          <span
            className="flex cursor-pointer items-center gap-[8px] text-gray-400"
            onClick={() => {
              setShowImage(2);
            }}
          >
            How
            <QuestionCircleOutlined />
          </span>
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
          <span>{`Paste "HOST:PORT" from NNR`}</span>
          <span
            className="flex cursor-pointer items-center gap-[8px] text-gray-400"
            onClick={() => {
              setShowImage(3);
            }}
          >
            How
            <QuestionCircleOutlined />
          </span>
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
