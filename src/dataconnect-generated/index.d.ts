import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateDemoUserData {
  user_insert: User_Key;
}

export interface CreateEnergyGoalData {
  energyGoal_insert: EnergyGoal_Key;
}

export interface CreateEnergyGoalVariables {
  name: string;
  period: string;
  startDate: DateString;
  targetValue: number;
  description?: string | null;
}

export interface Device_Key {
  id: UUIDString;
  __typename?: 'Device_Key';
}

export interface EnergyGoal_Key {
  id: UUIDString;
  __typename?: 'EnergyGoal_Key';
}

export interface EnergyReading_Key {
  id: UUIDString;
  __typename?: 'EnergyReading_Key';
}

export interface GetHomeForUserData {
  homes: ({
    id: UUIDString;
    name: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
  } & Home_Key)[];
}

export interface Home_Key {
  id: UUIDString;
  __typename?: 'Home_Key';
}

export interface ListEnergyReadingsForHomeData {
  energyReadings: ({
    id: UUIDString;
    value: number;
    unit: string;
    timestamp: TimestampString;
  } & EnergyReading_Key)[];
}

export interface ListEnergyReadingsForHomeVariables {
  homeId: UUIDString;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateDemoUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDemoUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateDemoUserData, undefined>;
  operationName: string;
}
export const createDemoUserRef: CreateDemoUserRef;

export function createDemoUser(): MutationPromise<CreateDemoUserData, undefined>;
export function createDemoUser(dc: DataConnect): MutationPromise<CreateDemoUserData, undefined>;

interface ListEnergyReadingsForHomeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEnergyReadingsForHomeVariables): QueryRef<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEnergyReadingsForHomeVariables): QueryRef<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;
  operationName: string;
}
export const listEnergyReadingsForHomeRef: ListEnergyReadingsForHomeRef;

export function listEnergyReadingsForHome(vars: ListEnergyReadingsForHomeVariables): QueryPromise<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;
export function listEnergyReadingsForHome(dc: DataConnect, vars: ListEnergyReadingsForHomeVariables): QueryPromise<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;

interface CreateEnergyGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEnergyGoalVariables): MutationRef<CreateEnergyGoalData, CreateEnergyGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEnergyGoalVariables): MutationRef<CreateEnergyGoalData, CreateEnergyGoalVariables>;
  operationName: string;
}
export const createEnergyGoalRef: CreateEnergyGoalRef;

export function createEnergyGoal(vars: CreateEnergyGoalVariables): MutationPromise<CreateEnergyGoalData, CreateEnergyGoalVariables>;
export function createEnergyGoal(dc: DataConnect, vars: CreateEnergyGoalVariables): MutationPromise<CreateEnergyGoalData, CreateEnergyGoalVariables>;

interface GetHomeForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetHomeForUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetHomeForUserData, undefined>;
  operationName: string;
}
export const getHomeForUserRef: GetHomeForUserRef;

export function getHomeForUser(): QueryPromise<GetHomeForUserData, undefined>;
export function getHomeForUser(dc: DataConnect): QueryPromise<GetHomeForUserData, undefined>;

