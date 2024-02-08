import * as fs from "fs";
import { join } from "path";
import satori from "satori";
import { FrameActionMessage } from "@farcaster/core";
import {
  QueryParameter,
  ResultsResponse,
  DuneClient,
} from "@cowprotocol/ts-dune-client";

const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

export async function generateImage(
  validMessage: FrameActionMessage,
  data: any
) {
  console.log("validMessage", validMessage);
  if (!validMessage) {
    return "";
  }
  const fid = validMessage?.data.fid;
  const { buttonIndex, inputText: inputTextBytes } =
    validMessage?.data.frameActionBody || {};
  // const inputText = inputTextBytes
  //   ? Buffer.from(inputTextBytes).toString("utf-8")
  //   : undefined;

  // avatar_url: 'https://i.imgur.com/IzJxuId.jpg',
  // display_name: 'Vitalik Buterin',
  // fid: 5650,
  // fname: 'vitalik.eth',
  // reactions_per_cast: 223,
  // tip_allowance: 207889,
  // total_degen_per_day: 25840172,
  // user_rank: 2,
  // wallet_address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

  console.log("dune data", data);
  const {
    avatar_url,
    user_rank,
    wallet_address,
    display_name,
    fname,
    reactions_per_cast,
    tip_allowance,
    total_degen_per_day,
  } = data;

  const imageSvg = await satori(
    <div
      style={{
        display: "flex", // Use flex layout
        flexDirection: "row", // Align items horizontally
        alignItems: "stretch", // Stretch items to fill the container height
        width: "100%",
        height: "100vh", // Full viewport height
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 24,
          paddingRight: 24,
          lineHeight: 1.2,
          fontSize: 36,
          color: "black",
          flex: 1,
          overflow: "hidden",
          marginTop: 24,
        }}
      >
        {buttonIndex && fid ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Button index: {buttonIndex}</div>
            <div style={{ display: "flex" }}>Fid: {fid}</div>
            <div style={{ display: "flex" }}>Name: {display_name}</div>
            <div style={{ display: "flex" }}>Rank: {user_rank}</div>
            <div style={{ display: "flex" }}>Fname: {fname}</div>
            <div style={{ display: "flex" }}>
              Wallet address: {wallet_address}
            </div>
            {/* <div style={{ display: "flex" }}>{inputText}</div> */}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            Hello world
          </div>
        )}
      </div>
    </div>,
    {
      width: 1146,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: interReg,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  return imageSvg;
}
