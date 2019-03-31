import React from 'react'
import {Main, AppView} from '@aragon/ui'
import styled from 'styled-components'
import {useAragonApi} from '@aragon/api-react'

import {livepeerTokenApprove, transferAppsTokens} from "../web3/LivepeerTokenScripts"
import {
    bondingManagerBond,
    bondingManagerUnbond,
    bondingManagerWithdraw,
    bondingManagerClaimEarnings
} from "../web3/BondingManagerScripts"
import approveAndBond from "../web3/ApproveAndBondScripts"

import LivepeerBalance from "./components/LivepeerTokenBalance"
import ApproveTokens from "./components/ApproveTokens"
import BondTokens from "./components/BondTokens"
import UnbondTokens from "./components/UnbondTokens"
import Addresses from "./components/Addresses";

const AppContainer = styled(AppView)`
    display: flex;
    flex-direction: column;
`
const BondBalanceApprovalContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
`

// TODO: Add defaultProps and propTypes to components. Extract strings. Extract common spacing (px values).
function App() {

    const {api, appState} = useAragonApi()

    const transferTokens = (toAddress, amount) => transferAppsTokens(api, toAddress, amount)

    const approveTokens = (approveTokenCount) => livepeerTokenApprove(api, approveTokenCount)

    const bondTokens = (tokenCount, bondToAddress) => bondingManagerBond(api, tokenCount, bondToAddress)

    const approveAndBondTokens = (tokenCount, bondToAddress) => approveAndBond(api, tokenCount, bondToAddress)

    const unbondTokens = (tokenCount) => bondingManagerUnbond(api, tokenCount)

    const claimEarnings = (upToRound) => bondingManagerClaimEarnings(api, upToRound)

    const withdrawTokens = (unbondingLockId) => bondingManagerWithdraw(api, unbondingLockId)

    return (
        <Main>
            <AppContainer title="Livepeer">

                <BondBalanceApprovalContainer>

                    <Addresses appState={appState}/>

                    <LivepeerBalance appState={appState} handleTransferTokens={transferTokens}/>

                    <ApproveTokens appState={appState} handleApproveTokens={approveTokens}/>

                    <BondTokens appState={appState} handleBondTokens={bondTokens}
                                handleApproveAndBond={approveAndBondTokens}/>

                </BondBalanceApprovalContainer>

                <UnbondTokens appState={appState} handleUnbondTokens={unbondTokens}
                              handleClaimEarnings={claimEarnings}
                              handleWithdrawTokens={withdrawTokens}/>

            </AppContainer>
        </Main>
    )
}

export default App