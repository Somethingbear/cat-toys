"use client";

import {
  Button,
  Input,
  QRCode,
  Tooltip,
  message,
  Image,
  Select,
  Divider,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import copy from "copy-to-clipboard";
import {
  CopyOutlined,
  EnterOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { base64Decode, base64Encode } from "@/utils/base64";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
// import Image from "next/image";

const baseUrl = "https://proxy.yxcharles.workers.dev/https://byte-transit.com";

const NNRTransfer = () => {
  // vmess://eyJ2IjogIjIiLCAicHMiOiAiOWNsb3VkLnZpcC0zOC4xNDMuMTguMTYyIiwgImFkZCI6ICJ1cy1zZC1oeS5oYXBweWNhdDEyLmNvbSIsICJwb3J0IjogMjU5OTcsICJpZCI6ICIzNTM2ZDlmNy1jOGJhLTQ4YTItODllMi05OTBlMmEyOGNmNDgiLCAiYWlkIjogIjAiLCAic2N5IjogImF1dG8iLCAibmV0IjogInRjcCIsICJ0eXBlIjogIm5vbmUiLCAiaG9zdCI6ICIiLCAicGF0aCI6ICIiLCAidGxzIjogIm5vbmUiLCAic25pIjogIiIsICJhbHBuIjogIiJ9
  const [originalStr, setOriginalStr] = useState<string>("");
  const [country, setCountry] = useState("美国");
  const [customCountry, setCustomCountry] = useState("");
  const [token, setToken] = useState("");
  // ebfee4d8-dd4a-4739-8459-f888f8fdbed1

  const [sid, setSid] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [newVmessStr, setNewVmessStr] = useState("");

  const domain = useMemo(() => {
    if (sid === "") return "";
    if (sid === "d7a4cec6-833f-4001-86d3-8b902415979e")
      return "ninestar.online";
    if (sid === "A001") return "starfly.online";
    if (sid === "4ad19243-6f48-47a4-bd21-fa44919c026a") return "ninestar.site";
  }, [sid]);

  const {
    data: serversData,
    isFetching: serversIsFetching,
    isError: serversIsError,
  } = useQuery({
    queryKey: ["/api/servers"],
    queryFn: ({ queryKey }) => {
      const [_key] = queryKey as [string];
      return axios.post<{ data: IServerItem[] }>(
        `${baseUrl}/api/servers`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        },
      );
    },
    // placeholderData: keepPreviousData,
    enabled: !!token,
  });

  const addRuleMutation = useMutation({
    mutationFn: (data: IAddRulePayload) => {
      return axios.post<{ data: IAddRuleResponse; status: 1 | 0 }>(
        `${baseUrl}/api/rules/add`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        },
      );
    },
    // onSuccess: (data) => {
    //   message.success("添加成功");
    // },
    onError: (error: any) => {
      // message.error("Copied");
    },
  });

  const originalVmessJson = useMemo(() => {
    if (!originalStr) return null;
    if (!originalStr.startsWith("vmess://")) return null;
    try {
      return JSON.parse(base64Decode(originalStr.split("://")[1]));
    } catch (e) {
      return null;
    }
  }, [originalStr]);

  const handleGenerate = () => {
    addRuleMutation.mutate(
      {
        sid,
        port: 0,
        remote: originalVmessJson.add,
        rport: Number(originalVmessJson.port),
        type: "tcp+udp",
        name,
        setting: {
          proxyProtocol: 0,
          loadbalanceMode: "roundrobin",
          mix0rtt: false,
          cfips: [],
        },
      },
      {
        onSuccess: (res) => {
          if (res.data.status === 0) {
            message.error(res.data.data as any);
          } else if (res.data.status === 1) {
            message.success("添加成功");
            const newVmessJson = {
              ...originalVmessJson,
              add: domain,
              port: res.data.data.port,
              ps: `${country ? `${country === "自定义" ? customCountry : country}-` : ""}${name === "" ? "" : `${name}-`}${originalVmessJson.ps}`,
            };
            const newVmessStr = `vmess://${base64Encode(
              JSON.stringify(newVmessJson),
            )}`;
            setNewVmessStr(newVmessStr);
          }
        },
      },
    );
  };

  return (
    <main className="flex max-w-[700px] flex-col gap-4 p-6">
      <h2>
        <Link
          href={"https://byte-transit.com/"}
          target="_blank"
          className=" text-blue-500 underline"
        >
          NNR
        </Link>{" "}
        API
      </h2>

      <section>
        <span className="flex items-center gap-4">
          <span>API Token</span>
        </span>
        <Input
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />
      </section>

      <section>
        <span className="flex items-center gap-4">
          <span>Copy&Paste Original Here</span>
        </span>
        <Input
          value={originalStr}
          onChange={(e) => {
            setOriginalStr(e.target.value);
          }}
        />
      </section>

      <section>
        <span className="flex">Country:</span>
        <Select
          className="w-full"
          value={country}
          onChange={(value) => {
            setCountry(value);
          }}
          allowClear
          options={[
            { value: "美国", label: "美国" },
            { value: "英国", label: "英国" },
            { value: "泰国", label: "泰国" },
            { value: "越南", label: "越南" },
            { value: "新加坡", label: "新加坡" },
            { value: "马来西亚", label: "马来西亚" },
            { value: "菲律宾", label: "菲律宾" },
            { value: "自定义", label: "自定义" },
          ]}
        />
        {country === "自定义" && (
          <Input 
            value={customCountry}
            onChange={(e) => {
              setCustomCountry(e.target.value);
            }}
          />
        )}
      </section>

      <section>
        <span className="flex">Server:</span>
        <Select
          className="w-[250px]"
          value={sid}
          onChange={(value) => {
            setSid(value);
          }}
          allowClear
        >
          {serversData?.data?.data?.map((item) => (
            <Select.Option key={item.sid} value={item.sid}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </section>

      <section>
        <span className="flex items-center gap-4">
          <span>Name</span>
        </span>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </section>

      <Button
        disabled={!token || !originalStr || !sid}
        loading={addRuleMutation.isPending}
        onClick={handleGenerate}
      >
        Generate
      </Button>

      <Divider />

      <section>
        New:
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

      {/* <button onClick={async () => {
        const res = await axios.post<{ data: IServerItem[] }>(
          `${baseUrl}/api/rules/`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              token: "ebfee4d8-dd4a-4739-8459-f888f8fdbed1",
            },
          },
        );
        console.log(res);
      }}>test</button> */}
    </main>
  );
};

export default NNRTransfer;
