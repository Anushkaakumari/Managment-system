import { useState, useEffect } from "react";
import { ethers } from "ethers";
import insuranceAbi from "../artifacts/contracts/GameToken.sol/Insurance.json";

export default function InsurancePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [insuranceContract, setInsuranceContract] = useState(undefined);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [policyAmount, setPolicyAmount] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);

  const contractAddress = "0xYourContractAddress"; // Replace with actual address
  const insuranceABI = insuranceAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getInsuranceContract();
  };

  const getInsuranceContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const insuranceContract = new ethers.Contract(contractAddress, insuranceABI, signer);

    setInsuranceContract(insuranceContract);
  };

  const getPolicies = async () => {
    if (insuranceContract) {
      const policyList = await insuranceContract.getPolicies();
      setPolicies(policyList);
    }
  };

  const getClaims = async () => {
    if (insuranceContract) {
      const claimList = await insuranceContract.getClaims();
      setClaims(claimList);
    }
  };

  const buyPolicy = async () => {
    if (insuranceContract && policyAmount > 0) {
      let tx = await insuranceContract.buyPolicy(account, policyAmount);
      await tx.wait();
      getPolicies();
    }
  };

  const fileClaim = async () => {
    if (insuranceContract && claimAmount > 0) {
      let tx = await insuranceContract.fileClaim(account, claimAmount);
      await tx.wait();
      getClaims();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <div>
          <input
            type="number"
            value={policyAmount}
            onChange={(e) => setPolicyAmount(Number(e.target.value))}
            placeholder="Policy amount"
          />
          <button onClick={buyPolicy}>Buy Policy</button>
        </div>
        <div>
          <input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(Number(e.target.value))}
            placeholder="Claim amount"
          />
          <button onClick={fileClaim}>File Claim</button>
        </div>
        <div>
          <h2>Policies</h2>
          <ul>
            {policies.map((policy, index) => (
              <li key={index}>{`Policy ${index + 1}: ${policy}`}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Claims</h2>
          <ul>
            {claims.map((claim, index) => (
              <li key={index}>{`Claim ${index + 1}: ${claim}`}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    getPolicies();
    getClaims();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Decentralized Insurance System</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}
