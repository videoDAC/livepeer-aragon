import BondingManagerAbi from '../abi/bondingManager-abi'
import LivepeerTokenAbi from '../abi/livepeerToken-abi'
import ControllerAbi from '../abi/controller-abi'
import RoundsManagerAbi from '../abi/roundsManager-abi'
import {CONTROLLER_ADDRESS} from "../config"
import {contractId} from './utils/livepeerHelpers'
import {map} from 'rxjs/operators'

//TODO: Convert to an object or use memoirzation and return const observables with shareReplay(1), could reduce load time.
// Perhaps put this off until we get errors in api.store(). Had problems experimenting with accessing 2 observables from this object at the same time.
const controller = (api) => api.external(CONTROLLER_ADDRESS, ControllerAbi)

const livepeerAddressOf$ = (api, livepeerContractName) => controller(api).getContract(contractId(livepeerContractName))

const livepeerTokenAddress$ = (api) => livepeerAddressOf$(api, "LivepeerToken")

const bondingManagerAddress$ = (api) => livepeerAddressOf$(api, "BondingManager")

const roundsManagerAddress$ = (api) => livepeerAddressOf$(api, "RoundsManager")

const livepeerToken$ = (api) =>
    livepeerTokenAddress$(api).pipe(
        // tap(address => console.log("LivepeerToken address: " + address)),
        map(address => api.external(address, LivepeerTokenAbi)))

const bondingManager$ = (api) =>
    bondingManagerAddress$(api).pipe(
        // tap(address => console.log("BondingManager address: " + address)),
        map(address => api.external(address, BondingManagerAbi)))

const roundsManager$ = (api) =>
    roundsManagerAddress$(api).pipe(
        // tap(address => console.log("RoundsManager address: " + address)),
        map(address => api.external(address, RoundsManagerAbi)))

export {
    livepeerTokenAddress$,
    bondingManagerAddress$,
    roundsManagerAddress$,
    livepeerToken$,
    bondingManager$,
    roundsManager$
}