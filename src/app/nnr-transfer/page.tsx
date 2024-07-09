"use client";

import { Button, Input, QRCode, Tooltip, message, Image, Select } from "antd";
import React, { useMemo, useState } from "react";
import copy from "copy-to-clipboard";
import {
  CopyOutlined,
  EnterOutlined,
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
  const [originalStr, setOriginalStr] = useState<string>("");
  const [hostPortNNR, setHostPortNNR] = useState<string>("");
  const [showImage, setShowImage] = useState(0);

  const [country, setCountry] = useState("美国");

  const originalVmessJson = useMemo(() => {
    if (!originalStr) return null;
    if (!originalStr.startsWith("vmess://")) return null;
    try {
      return JSON.parse(base64Decode(originalStr.split("://")[1]));
    } catch (e) {
      return null;
    }
  }, [originalStr]);

  const extractHostPort = (ssString: string): string | null => {
    const regex = /@([^#]+)#/;
    const matches = ssString.match(regex);
    return matches ? matches[1] : null;
  };

  const originalSSJson = useMemo(() => {
    if (!originalStr) return null;
    if (!originalStr.startsWith("ss://")) return null;
    const hostPort = extractHostPort(originalStr);
    return {
      host: hostPort ? hostPort.split(":")[0] : "",
      port: hostPort ? hostPort.split(":")[1] : "",
    };
  }, [originalStr]);

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
      ps: `${country ? `${country}-` : ""}${originalVmessJson.ps}`,
    };
  }, [hostPortNNR, originalVmessJson, country]);

  const newVmessStr = useMemo(() => {
    return newVmessJson
      ? `vmess://${base64Encode(JSON.stringify(newVmessJson))}`
      : "";
  }, [newVmessJson]);

  const extractPreHostPort =(ssString: string): string | null => {
    const regex = /^ss:\/\/([^@]+)/;
    const matches = ssString.match(regex);
    return matches ? matches[1] : null;
  }

  const newSSStr = useMemo(() => {
    const cipherPassword = extractPreHostPort(originalStr);
    if (!cipherPassword) {
      return "";
    }
    const [host, port] = hostPortNNR.split(":");
    if (!host || !port) {
      return "";
    }
    return `ss://${cipherPassword}@${host}:${port}#${country ? `${country}-` : ""}${originalSSJson?.host}`;
  }, [originalStr, originalSSJson, hostPortNNR, country])

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
          className="cursor-pointer text-blue-300 underline"
          onClick={() => {
            copy("starfly.online:");
            message.success("Copied");
          }}
        >
          starfly.online
          <CopyOutlined />
        </span>
        <span
          className="cursor-pointer text-blue-300 underline"
          onClick={() => {
            copy("ninestar.online:");
            message.success("Copied");
          }}
        >
          ninestar.online
          <CopyOutlined />
        </span>
      </div>

      <section>
        <span className="flex items-center gap-4">
          <span>Copy&Paste Original Here</span>
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
          value={originalStr}
          onChange={(e) => {
            setOriginalStr(e.target.value);
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
          value={originalVmessJson?.add || originalSSJson?.host}
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
          value={originalVmessJson?.port || originalSSJson?.port}
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
          <span
            className="cursor-pointer text-blue-300 underline"
            onClick={() => {
              setHostPortNNR("starfly.online:");
            }}
          >
            starfly.online
            <EnterOutlined />
          </span>
          <span
            className="cursor-pointer text-blue-300 underline"
            onClick={() => {
              setHostPortNNR("ninestar.online:");
            }}
          >
            ninestar.online
            <EnterOutlined />
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
        <span className="flex">Country:</span>
        <Select
          className="w-[250px]"
          value={country}
          onChange={(value) => {
            setCountry(value);
          }}
          allowClear
        >
          <Select.Option value="美国">美国</Select.Option>
          <Select.Option value="英国">英国</Select.Option>
          <Select.Option value="泰国">泰国</Select.Option>
          <Select.Option value="越南">越南</Select.Option>
          <Select.Option value="新加坡">新加坡</Select.Option>
          <Select.Option value="马来西亚">马来西亚</Select.Option>
          <Select.Option value="菲律宾">菲律宾</Select.Option>
        </Select>
      </section>

      <section>
        New:
        <Input
          value={newVmessStr || newSSStr}
          readOnly
          disabled
          suffix={
            <CopyOutlined
              onClick={() => {
                if (!newVmessStr || !newSSStr) return;
                copy(newVmessStr || newSSStr);
                message.success("Copied");
              }}
            />
          }
        />
      </section>
      <section>{(newVmessStr || newSSStr) && <QRCode value={newVmessStr || newSSStr} />}</section>
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
