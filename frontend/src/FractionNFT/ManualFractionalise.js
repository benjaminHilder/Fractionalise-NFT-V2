import { React, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Alert, Form} from 'react-bootstrap'
import { ethers, BigNumber } from 'ethers';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

import Storage from "../Json/Storage.json";
import axios from "axios";

import { RinkebyStorageAddress } from '../App';

function ManualFractionalise() {
    const [nftContractAddress, setNftContractAddress] = useState("");
    const [nftId, setNftId] = useState("")
    const [fractionTokenName, setFractionTokenName] = useState("")
    const [fractionTokenTicker, setFractionTokenTicker] = useState("")
    const [tokenSupply, setTokenSupply] = useState("")
    const [tokenRoyalty, setTokenRoyalty] = useState("")

    const [nftAbi, setNftAbi] = useState("");

    const handleNftContractAddressChange = (event) => setNftContractAddress(event.target.value);
    const handleNftIdChange = (event) => setNftId(event.target.value);
    const handleFractionTokenNameChange = (event) => setFractionTokenName(event.target.value);
    const handleFractionTokenTickerChange = (event) => setFractionTokenTicker(event.target.value);
    const handleTokenSupplyChange = (event) => setTokenSupply(event.target.value);
    const handleTokenRoyaltyChange = (event) => setTokenRoyalty(event.target.value);

    const etherScanApi = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${nftContractAddress}&apikey=QF41CVNJWPQBFG2WKQPSCW345TYU5WMTKY`

    const getAbi = async () => {
        let res = await axios.get(etherScanApi)
        setNftAbi(JSON.parse(res.data.result))
    }

    async function handleApproveNftContract() {
        if(window.ethereum) {
            getAbi()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                nftContractAddress,
                nftAbi,
                signer
            );
            try {
                const response = await contract.approve(RinkebyStorageAddress, nftId);
                console.log('response: ', response);
            } catch (err) {
                console.log("error", err);
            }
        }
    }

    async function handleDepositNft() {
        if(window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                RinkebyStorageAddress,
                Storage.abi,
                signer
            );
            try {
                const response = await contract.depositNft(nftContractAddress, nftId);

                console.log('response: ', response);
            } catch (err) {
                console.log("error", err);
            }
        }
    }
    
    async function handleFractionNft() {
        if(window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                RinkebyStorageAddress,
                Storage.abi,
                signer
            );

            try {
                const response = await contract.createFraction(nftContractAddress,
                                                               BigNumber.from(nftId),
                                                               fractionTokenName.toString(),
                                                               fractionTokenTicker.toString(),
                                                               BigNumber.from(tokenSupply),
                                                               BigNumber.from(tokenRoyalty));
                console.log('response: ', response);
            } catch (err) {
            console.log("error", err);
            }
        }
    }

    return (
    <div>
        <Alert>Fraction NFT</Alert>
        <CustomLink to="/FractionNFT">Back</CustomLink>
        <Form>
            <Form.Group>
                <Form.Label>Contract Address:</Form.Label>
                <Form.Control 
                    placeholder="Enter Contract Address"
                    onChange={handleNftContractAddressChange}/>
                <Form.Label>NFT ID:</Form.Label>
                <Form.Control 
                    placeholder="Enter NFT ID"
                    onChange={handleNftIdChange}/>
                <Form.Label>Fraction Token Name:</Form.Label>
                <Form.Control 
                    placeholder="Enter Fraction Token Name"
                    onChange={handleFractionTokenNameChange}/>
                <Form.Label>Fraction Token Ticker:</Form.Label>
                <Form.Control 
                    placeholder="Enter Token Ticker"
                    onChange={handleFractionTokenTickerChange}/>
                <Form.Label>Token Supply:</Form.Label>
                <Form.Control 
                    placeholder="Enter Fraction Token supply"
                    onChange={handleTokenSupplyChange}/>
                <Form.Label>Token Royalty:</Form.Label>
                <Form.Control 
                    placeholder="Enter Fraction Token Royalty"
                    onChange={handleTokenRoyaltyChange}/>
            </Form.Group>

            <Button
            onClick={handleApproveNftContract}>Approve Contract</Button>
            
            <Button
            onClick={handleDepositNft}>Deposit NFT</Button>
            
            <Button
            onClick={handleFractionNft}>Fraction NFT</Button>
        </Form>
    </div>
    );

    function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
        return (
            <li className={isActive ? "active" : ""}>
                <Link to={to} {...props}>{children}</Link>
            </li>
        )
    }
}

export default ManualFractionalise;