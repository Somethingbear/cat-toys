"use client";

import { base64Decode } from "@/utils/base64";
import { Input, QRCode, Table, TableProps } from "antd";
import { useMemo, useState } from "react";

const QrcodeList = () => {
  const [originalStr, setOriginalStr] = useState<string>("");
  const vmessStrArr = useMemo(() => {
    return originalStr.split("\n").filter(Boolean);
  }, [originalStr]);

  const columns: TableProps<{ id: number; origin: string }>["columns"] = [
    {
      title: "Origin",
      dataIndex: "origin",
      key: "origin",
      width: 200,
      // ellipsis: true,
      render: (value, record, index) => {
        return <div className="w-[200px] truncate">{value}</div>;
      },
    },
    {
      title: "Host",
      dataIndex: "origin",
      key: "host",
      width: 200,
      render: (value, record, index) => {
        if (value.startsWith("vmess://")) {
          const vmessJson = JSON.parse(base64Decode(value.split("://")[1]));
          return vmessJson?.add;
        } else if (value.startsWith("ss://")) {
          const regex = /@([^#]+)#/;
          const matches = value.match(regex);
          const hostPort = matches ? matches[1] : null;
          return hostPort ? hostPort.split(":")[0] : "";
        }
        return "--";
      },
    },
    {
      title: "Port",
      dataIndex: "origin",
      key: "port",
      width: 200,
      render: (value, record, index) => {
        if (value.startsWith("vmess://")) {
          const vmessJson = JSON.parse(base64Decode(value.split("://")[1]));
          return vmessJson?.port;
        } else if (value.startsWith("ss://")) {
          const regex = /@([^#]+)#/;
          const matches = value.match(regex);
          const hostPort = matches ? matches[1] : null;
          return hostPort ? hostPort.split(":")[1] : "";
        }
        return "--";
      },
    },
    {
      title: "Remark",
      dataIndex: "origin",
      key: "host",
      width: 200,
      render: (value, record, index) => {
        if (value.startsWith("vmess://")) {
          const vmessJson = JSON.parse(base64Decode(value.split("://")[1]));
          return vmessJson?.ps;
        } else if (value.startsWith("ss://")) {
        }
        return "--";
      },
    },
    {
      title: "Qrcode",
      dataIndex: "origin",
      key: "qrcode",
      width: 200,
      render: (value, record, index) => {
        return <QRCode value={value} />;
      },
    },
  ];

  return (
    <main className="flex max-w-[1300px] flex-col gap-4 p-6">
      <h2 className="print:hidden">Qrocde Transfer</h2>

      <section className="print:hidden">
        <span className="flex items-center gap-4">
          <span>{`Copy&Paste Original Here (${vmessStrArr.length})`}</span>
        </span>
        <Input.TextArea
          value={originalStr}
          onChange={(e) => {
            setOriginalStr(e.target.value);
          }}
        />
      </section>

      <section>
        <Table
          dataSource={vmessStrArr.map((item, index) => ({
            id: index,
            origin: item,
          }))}
          columns={columns}
          pagination={false}
        />
      </section>
    </main>
  );
};

export default QrcodeList;
