interface IServerItem {
  /** "d7a4cec6-833f-4001-86d3-8b902415979e" */
  sid: string;
  /** "neko_relay" */
  type: string;
  /** "深港IEPL x1" */
  name: string;
  /** "Excellent latency and speed assurance\nLow DDoS protection may result in unavailability during significant attacks\n优秀的延迟与速度保证\n低DDOS保护，在遭受较大攻击时可能不可用" */
  detail: string;
  /** "183.236.51.15" */
  host: string;
  /** 23 */
  min: number;
  /** 65000 */
  max: number;
  /** 5 */
  mf: number;
  /** 2 */
  level: number;
  /** 0 */
  top: number;
  /** 1 */
  status: number;
  /** ["tcp+udp"] */
  types: string[];
}

interface IAddRulePayload {
  /** sid	是	节点(源服务器)id	gzyd */
  sid: string;
  /** port	否	源端口 (留空自动分配)	25555 */
  port?: number;
  /** remote	是	目标服务器域名或IP (支持DDNS)	8.8.8.8 */
  remote: string;
  /** rport	是	目标端口	22 */
  rport: number;
  /** type	是	规则协议(需节点支持)	tcp */
  type: string;
  /** name	否	规则名称/备注	test */
  name?: string;
  /** setting	否	规则设置	{"loadbalanceMode": "fallback"} */
  setting?: any;
}

interface IAddRuleResponse {
  /** 规则id */
  rid: string;
  /** 节点id */
  sid: string;
  /** 节点地址 域名/ip */
  host: string;
  /** 源端口 */
  port: number;
  /** 目标地址 */
  remote: string;
  /** 目标端口 */
  rport: number;
  /** 规则协议 */
  type: string;
  /** 规则备注/名称 */
  name: string;
  /** 规则已使用流量(单位B) */
  traffic: number;
  /** 规则设置 */
  setting: any;
  
}
