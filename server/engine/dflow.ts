import axios from "axios";

const DFLOW_API = "https://pond.dflow.net/api/v1/swap";

export async function getDFlowRoute({
  inputMint,
  outputMint,
  amount,
}: {
  inputMint: string;
  outputMint: string;
  amount: number;
}) {
  const res = await axios.post(DFLOW_API, {
    inputMint,
    outputMint,
    amount,
  });

  return res.data;
}
