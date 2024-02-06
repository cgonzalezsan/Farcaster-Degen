import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  validateActionSignature,
} from "frames.js/next/server";
import Link from "next/link";
import { DEBUG_HUB_OPTIONS } from "../debug/constants";
import { generateImage } from "../generate-image";
import { QueryParameter, DuneClient } from "@cowprotocol/ts-dune-client";
// import { DEBUG_HUB_OPTIONS } from "./debug/constants";
// import { generateImage } from "./generate-image";

type State = {
  active: string;
  total_button_presses: number;
};

const initialState = { active: "1", total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    total_button_presses: state.total_button_presses + 1,
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
  };
};

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const validMessage = await validateActionSignature(
    previousFrame.postBody,
    DEBUG_HUB_OPTIONS
  );

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
  // example: load the users credentials & check they have an NFT
  const image = await generateImage(validMessage!);
  const { DUNE_API_KEY } = process.env;

  const client = new DuneClient(DUNE_API_KEY ?? "");
  const queryID = 3408327;
  // const parameters = [
  //   QueryParameter.text("TextField", "Plain Text"),
  //   QueryParameter.number("NumberField", 3.1415926535),
  //   QueryParameter.date("DateField", "2022-05-04 00:00:00"),
  //   QueryParameter.enum("ListField", "Option 1"),
  // ];

  const output = await client.refresh(queryID);
  // .then((executionResult) => console.log(executionResult.result?.rows));

  // console.log("output.result.rows[0]", output.result.rows[0]);
  console.log("State is:", state);

  // then, when done, return next frame
  return (
    <div>
      Starter kit. <Link href="/debug">Debug</Link>
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        {/* <FrameImage
          src={output ? (output.result.rows[0].avatar_url as string) : image}
        /> */}
        {/* <FrameImage
          src={`data:image/svg+xml,${encodeURIComponent(imageSvg)}`}
        /> */}
        <FrameInput text="put some text here" />
        <FrameButton onClick={dispatch}>
          {state?.active === "1" ? "Active" : "Inactive"}
        </FrameButton>
        <FrameButton onClick={dispatch}>
          {state?.active === "2" ? "Active" : "Inactive"}
        </FrameButton>
        <FrameButton href={`http://localhost:3000/`}>Page link</FrameButton>
        <FrameButton href={`https://www.google.com`}>External</FrameButton>
      </FrameContainer>
    </div>
  );
}
