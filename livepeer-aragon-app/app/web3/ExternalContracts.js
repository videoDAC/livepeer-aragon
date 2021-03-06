import AgentAbi from '../abi/agent-abi'
import BondingManagerAbi from '../abi/bondingManager-abi'
import LivepeerTokenAbi from '../abi/livepeerToken-abi'
import ControllerAbi from '../abi/controller-abi'
import RoundsManagerAbi from '../abi/roundsManager-abi'
import JobsManagerAbi from '../abi/jobsManager-abi'
import ServiceRegistryAbi from '../abi/serviceRegistry-abi'
import {contractId} from './utils/livepeerHelpers'
import {map, mergeMap, tap} from 'rxjs/operators'

//TODO: Convert to an object or use memoirzation and return const observables with shareReplay(1), could reduce load time.

const agentAddress$ = api => api.call('agent')

const agentApp$ = (api) =>
    agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, AgentAbi)))

const controllerAddress$ = (api) => api.call("livepeerController")

const controller$ = (api) =>
    controllerAddress$(api).pipe(
        map(controllerAddress => api.external(controllerAddress, ControllerAbi)))

const livepeerAddressOf$ = (api, livepeerContractName) =>
    controller$(api).pipe(
        mergeMap(controller => controller.getContract(contractId(livepeerContractName))))

const livepeerTokenAddress$ = (api) => livepeerAddressOf$(api, "LivepeerToken")

const bondingManagerAddress$ = (api) => livepeerAddressOf$(api, "BondingManager")

const roundsManagerAddress$ = (api) => livepeerAddressOf$(api, "RoundsManager")

const jobsManagerAddress$ = api => livepeerAddressOf$(api, "JobsManager")

const serviceRegistryAddress$ = (api) => livepeerAddressOf$(api, "ServiceRegistry")

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

const jobsManager$ = (api) =>
    jobsManagerAddress$(api).pipe(
        map(address => api.external(address, JobsManagerAbi)))

const serviceRegistry$ = (api) =>
    serviceRegistryAddress$(api).pipe(
        // tap(address => console.log("ServiceRegistry address: " + address)),
        map(address => api.external(address, ServiceRegistryAbi)))

export {
    agentAddress$,
    agentApp$,
    controllerAddress$,
    livepeerTokenAddress$,
    bondingManagerAddress$,
    roundsManagerAddress$,
    livepeerToken$,
    bondingManager$,
    roundsManager$,
    jobsManager$,
    serviceRegistry$
}