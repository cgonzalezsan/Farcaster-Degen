import { getFrame } from "frames.js";
import { NextRequest } from "next/server";
import {
  QueryParameter,
  ResultsResponse,
  DuneClient,
} from "@cowprotocol/ts-dune-client";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { DUNE_API_KEY } = process.env;

    const client = new DuneClient(DUNE_API_KEY ?? "");
    const queryID = 3408327;

    // Add the API key to an header object
    // const meta = {
    //   "x-dune-api-key": DUNE_API_KEY as string,
    // };
    // const header = new Headers(meta);

    // //  Call the Dune API
    // const response = await fetch(
    //   `https://api.dune.com/api/v1/query/${queryID}/execute`,
    //   {
    //     method: "POST",
    //     headers: header,
    //   }
    // );
    // const output = await response.text();

    // const parameters = [
    //   QueryParameter.text("TextField", "Plain Text"),
    //   QueryParameter.number("NumberField", 3.1415926535),
    //   QueryParameter.date("DateField", "2022-05-04 00:00:00"),
    //   QueryParameter.enum("ListField", "Option 1"),
    // ];

    const output = await client.refresh(queryID);

    const data = (output?.result?.rows[0] || {}) as any;

    console.log("output is:", output);
    return Response.json({ data });
  } catch (err) {
    console.error(err);
    return Response.error();
  }
}
