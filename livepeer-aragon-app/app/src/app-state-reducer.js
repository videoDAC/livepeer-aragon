import {fromDecimals} from './lib/math-utils';
import {BN} from '../../node_modules/bn.js/lib/bn';
import {TOKEN_DECIMALS} from '../SharedConstants';

//TODO: Break reducer up into smaller groups of state transformations, move some processing to components and null check there.

const PERCENTAGE_AS_FRACTION_DIVISOR = 10000;

const TRANSCODER_STATUS = {
    0: 'Not Registered',
    1: 'Registered'
}

const DELEGATOR_STATUS = {
    'PENDING': 0,
    'BONDED': 1,
    'UNBONDED': 2
}

let defaultState = {
    agentAddress: '0x0000000000000000000000000000000000000000',
    appAddress: '0x0000000000000000000000000000000000000000',
    livepeerTokenAddress: '0x0000000000000000000000000000000000000000',
    appEthBalance: 0,
    appsLptBalance: 0,
    appApprovedTokens: 0,
    currentRound: 0,
    delegatorInfo: {
        bondedAmount: 0,
        pendingFees: 0,
        showPendingFees: false,
        fees: 0,
        delegateAddress: '',
        delegatedAmount: 0,
        lastClaimRound: 0,
        pendingStake: 0,
        delegatorStatus: 0
    },
    disableUnbondTokens: false,
    unbondingLockInfos: [],
    transcoder: {
        status: TRANSCODER_STATUS[0],
        active: false,
        lastRewardRound: 0,
        rewardCut: 0,
        feeShare: 0,
        pricePerSegment: 0,
        pendingRewardCut: 0,
        pendingFeeShare: 0,
        pendingPricePerSegment: 0,
        disableReward: false,
        serviceUri: ''
    }
}

const reducer = state => {

    if (state === null) {
        return defaultState
    }

    const {
        appEthBalance,
        appsLptBalance,
        appApprovedTokens,
        delegatorInfo,
        unbondingLockInfos,
        transcoder,
        currentRound
    } = state

    const {
        pendingFees,
        fees,
        delegatedAmount,
        delegatorStatus,
        bondedAmount,
        pendingStake
    } = delegatorInfo

    const {
        status,
        rewardCut,
        feeShare,
        pendingRewardCut,
        pendingFeeShare,
        lastRewardRound
    } = transcoder

    return {
        ...state,
        appEthBalance: fromDecimals(appEthBalance ? appEthBalance.toString() : "0", TOKEN_DECIMALS),
        appsLptBalance: fromDecimals(appsLptBalance ? appsLptBalance.toString() : "0", TOKEN_DECIMALS),
        appApprovedTokens: fromDecimals(appApprovedTokens ? appApprovedTokens.toString() : "0", TOKEN_DECIMALS),
        delegatorInfo: {
            ...delegatorInfo,
            pendingFees: fromDecimals(pendingFees ? pendingFees.toString() : "0", TOKEN_DECIMALS),
            showPendingFees: showPendingFees(pendingFees ? pendingFees : "0", fees),
            fees: fromDecimals(fees ? fees.toString() : "0", TOKEN_DECIMALS),
            delegatedAmount: fromDecimals(delegatedAmount ? delegatedAmount.toString() : "0", TOKEN_DECIMALS),
            totalStake: calculateTotalStake(bondedAmount, pendingStake),
            delegatorStatus: parseInt(delegatorStatus)
        },
        unbondingLockInfos: formatUnbondingLockInfos(unbondingLockInfos),
        transcoder: {
            ...transcoder,
            status: TRANSCODER_STATUS[status],
            rewardCut: rewardCut / PERCENTAGE_AS_FRACTION_DIVISOR,
            feeShare: feeShare / PERCENTAGE_AS_FRACTION_DIVISOR,
            pendingRewardCut: pendingRewardCut / PERCENTAGE_AS_FRACTION_DIVISOR,
            pendingFeeShare: pendingFeeShare / PERCENTAGE_AS_FRACTION_DIVISOR,
            disableReward: lastRewardRound === currentRound
        }
    }
}

const formatUnbondingLockInfos = unbondingLockInfos =>
    unbondingLockInfos.map(unbondingLockInfo => {
        return {
            ...unbondingLockInfo,
            amount: fromDecimals(unbondingLockInfo.amount, TOKEN_DECIMALS)
        }
    })

const showPendingFees = (pendingFees, fees) => {
    return !(new BN(pendingFees).eq(new BN(0))) && pendingFees !== fees
}

const calculateTotalStake = (bondedAmount, pendingStake) => {
    const bondedAmountBn = new BN(bondedAmount ? bondedAmount : 0)
    const pendingStakeBn = new BN(pendingStake ? pendingStake : 0)
    const totalStake = bondedAmountBn.gt(pendingStakeBn) ? bondedAmountBn : pendingStakeBn
    return fromDecimals(totalStake.toString(), TOKEN_DECIMALS)
}

export default reducer
export {
    DELEGATOR_STATUS
}