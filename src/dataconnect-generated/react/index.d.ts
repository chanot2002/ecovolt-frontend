import { CreateDemoUserData, ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables, CreateEnergyGoalData, CreateEnergyGoalVariables, GetHomeForUserData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateDemoUser(options?: useDataConnectMutationOptions<CreateDemoUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoUserData, undefined>;
export function useCreateDemoUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDemoUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoUserData, undefined>;

export function useListEnergyReadingsForHome(vars: ListEnergyReadingsForHomeVariables, options?: useDataConnectQueryOptions<ListEnergyReadingsForHomeData>): UseDataConnectQueryResult<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;
export function useListEnergyReadingsForHome(dc: DataConnect, vars: ListEnergyReadingsForHomeVariables, options?: useDataConnectQueryOptions<ListEnergyReadingsForHomeData>): UseDataConnectQueryResult<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;

export function useCreateEnergyGoal(options?: useDataConnectMutationOptions<CreateEnergyGoalData, FirebaseError, CreateEnergyGoalVariables>): UseDataConnectMutationResult<CreateEnergyGoalData, CreateEnergyGoalVariables>;
export function useCreateEnergyGoal(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEnergyGoalData, FirebaseError, CreateEnergyGoalVariables>): UseDataConnectMutationResult<CreateEnergyGoalData, CreateEnergyGoalVariables>;

export function useGetHomeForUser(options?: useDataConnectQueryOptions<GetHomeForUserData>): UseDataConnectQueryResult<GetHomeForUserData, undefined>;
export function useGetHomeForUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetHomeForUserData>): UseDataConnectQueryResult<GetHomeForUserData, undefined>;
