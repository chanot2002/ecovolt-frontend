# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListEnergyReadingsForHome*](#listenergyreadingsforhome)
  - [*GetHomeForUser*](#gethomeforuser)
- [**Mutations**](#mutations)
  - [*CreateDemoUser*](#createdemouser)
  - [*CreateEnergyGoal*](#createenergygoal)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListEnergyReadingsForHome
You can execute the `ListEnergyReadingsForHome` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEnergyReadingsForHome(vars: ListEnergyReadingsForHomeVariables): QueryPromise<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;

interface ListEnergyReadingsForHomeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEnergyReadingsForHomeVariables): QueryRef<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;
}
export const listEnergyReadingsForHomeRef: ListEnergyReadingsForHomeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEnergyReadingsForHome(dc: DataConnect, vars: ListEnergyReadingsForHomeVariables): QueryPromise<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;

interface ListEnergyReadingsForHomeRef {
  ...
  (dc: DataConnect, vars: ListEnergyReadingsForHomeVariables): QueryRef<ListEnergyReadingsForHomeData, ListEnergyReadingsForHomeVariables>;
}
export const listEnergyReadingsForHomeRef: ListEnergyReadingsForHomeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEnergyReadingsForHomeRef:
```typescript
const name = listEnergyReadingsForHomeRef.operationName;
console.log(name);
```

### Variables
The `ListEnergyReadingsForHome` query requires an argument of type `ListEnergyReadingsForHomeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEnergyReadingsForHomeVariables {
  homeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListEnergyReadingsForHome` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEnergyReadingsForHomeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEnergyReadingsForHomeData {
  energyReadings: ({
    id: UUIDString;
    value: number;
    unit: string;
    timestamp: TimestampString;
  } & EnergyReading_Key)[];
}
```
### Using `ListEnergyReadingsForHome`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEnergyReadingsForHome, ListEnergyReadingsForHomeVariables } from '@dataconnect/generated';

// The `ListEnergyReadingsForHome` query requires an argument of type `ListEnergyReadingsForHomeVariables`:
const listEnergyReadingsForHomeVars: ListEnergyReadingsForHomeVariables = {
  homeId: ..., 
};

// Call the `listEnergyReadingsForHome()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEnergyReadingsForHome(listEnergyReadingsForHomeVars);
// Variables can be defined inline as well.
const { data } = await listEnergyReadingsForHome({ homeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEnergyReadingsForHome(dataConnect, listEnergyReadingsForHomeVars);

console.log(data.energyReadings);

// Or, you can use the `Promise` API.
listEnergyReadingsForHome(listEnergyReadingsForHomeVars).then((response) => {
  const data = response.data;
  console.log(data.energyReadings);
});
```

### Using `ListEnergyReadingsForHome`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEnergyReadingsForHomeRef, ListEnergyReadingsForHomeVariables } from '@dataconnect/generated';

// The `ListEnergyReadingsForHome` query requires an argument of type `ListEnergyReadingsForHomeVariables`:
const listEnergyReadingsForHomeVars: ListEnergyReadingsForHomeVariables = {
  homeId: ..., 
};

// Call the `listEnergyReadingsForHomeRef()` function to get a reference to the query.
const ref = listEnergyReadingsForHomeRef(listEnergyReadingsForHomeVars);
// Variables can be defined inline as well.
const ref = listEnergyReadingsForHomeRef({ homeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEnergyReadingsForHomeRef(dataConnect, listEnergyReadingsForHomeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.energyReadings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.energyReadings);
});
```

## GetHomeForUser
You can execute the `GetHomeForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getHomeForUser(): QueryPromise<GetHomeForUserData, undefined>;

interface GetHomeForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetHomeForUserData, undefined>;
}
export const getHomeForUserRef: GetHomeForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getHomeForUser(dc: DataConnect): QueryPromise<GetHomeForUserData, undefined>;

interface GetHomeForUserRef {
  ...
  (dc: DataConnect): QueryRef<GetHomeForUserData, undefined>;
}
export const getHomeForUserRef: GetHomeForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getHomeForUserRef:
```typescript
const name = getHomeForUserRef.operationName;
console.log(name);
```

### Variables
The `GetHomeForUser` query has no variables.
### Return Type
Recall that executing the `GetHomeForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetHomeForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetHomeForUserData {
  homes: ({
    id: UUIDString;
    name: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
  } & Home_Key)[];
}
```
### Using `GetHomeForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getHomeForUser } from '@dataconnect/generated';


// Call the `getHomeForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getHomeForUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getHomeForUser(dataConnect);

console.log(data.homes);

// Or, you can use the `Promise` API.
getHomeForUser().then((response) => {
  const data = response.data;
  console.log(data.homes);
});
```

### Using `GetHomeForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getHomeForUserRef } from '@dataconnect/generated';


// Call the `getHomeForUserRef()` function to get a reference to the query.
const ref = getHomeForUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getHomeForUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.homes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.homes);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateDemoUser
You can execute the `CreateDemoUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDemoUser(): MutationPromise<CreateDemoUserData, undefined>;

interface CreateDemoUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDemoUserData, undefined>;
}
export const createDemoUserRef: CreateDemoUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDemoUser(dc: DataConnect): MutationPromise<CreateDemoUserData, undefined>;

interface CreateDemoUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateDemoUserData, undefined>;
}
export const createDemoUserRef: CreateDemoUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDemoUserRef:
```typescript
const name = createDemoUserRef.operationName;
console.log(name);
```

### Variables
The `CreateDemoUser` mutation has no variables.
### Return Type
Recall that executing the `CreateDemoUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDemoUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDemoUserData {
  user_insert: User_Key;
}
```
### Using `CreateDemoUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDemoUser } from '@dataconnect/generated';


// Call the `createDemoUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDemoUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDemoUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createDemoUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateDemoUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDemoUserRef } from '@dataconnect/generated';


// Call the `createDemoUserRef()` function to get a reference to the mutation.
const ref = createDemoUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDemoUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateEnergyGoal
You can execute the `CreateEnergyGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEnergyGoal(vars: CreateEnergyGoalVariables): MutationPromise<CreateEnergyGoalData, CreateEnergyGoalVariables>;

interface CreateEnergyGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEnergyGoalVariables): MutationRef<CreateEnergyGoalData, CreateEnergyGoalVariables>;
}
export const createEnergyGoalRef: CreateEnergyGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEnergyGoal(dc: DataConnect, vars: CreateEnergyGoalVariables): MutationPromise<CreateEnergyGoalData, CreateEnergyGoalVariables>;

interface CreateEnergyGoalRef {
  ...
  (dc: DataConnect, vars: CreateEnergyGoalVariables): MutationRef<CreateEnergyGoalData, CreateEnergyGoalVariables>;
}
export const createEnergyGoalRef: CreateEnergyGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEnergyGoalRef:
```typescript
const name = createEnergyGoalRef.operationName;
console.log(name);
```

### Variables
The `CreateEnergyGoal` mutation requires an argument of type `CreateEnergyGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEnergyGoalVariables {
  name: string;
  period: string;
  startDate: DateString;
  targetValue: number;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateEnergyGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEnergyGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEnergyGoalData {
  energyGoal_insert: EnergyGoal_Key;
}
```
### Using `CreateEnergyGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEnergyGoal, CreateEnergyGoalVariables } from '@dataconnect/generated';

// The `CreateEnergyGoal` mutation requires an argument of type `CreateEnergyGoalVariables`:
const createEnergyGoalVars: CreateEnergyGoalVariables = {
  name: ..., 
  period: ..., 
  startDate: ..., 
  targetValue: ..., 
  description: ..., // optional
};

// Call the `createEnergyGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEnergyGoal(createEnergyGoalVars);
// Variables can be defined inline as well.
const { data } = await createEnergyGoal({ name: ..., period: ..., startDate: ..., targetValue: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEnergyGoal(dataConnect, createEnergyGoalVars);

console.log(data.energyGoal_insert);

// Or, you can use the `Promise` API.
createEnergyGoal(createEnergyGoalVars).then((response) => {
  const data = response.data;
  console.log(data.energyGoal_insert);
});
```

### Using `CreateEnergyGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEnergyGoalRef, CreateEnergyGoalVariables } from '@dataconnect/generated';

// The `CreateEnergyGoal` mutation requires an argument of type `CreateEnergyGoalVariables`:
const createEnergyGoalVars: CreateEnergyGoalVariables = {
  name: ..., 
  period: ..., 
  startDate: ..., 
  targetValue: ..., 
  description: ..., // optional
};

// Call the `createEnergyGoalRef()` function to get a reference to the mutation.
const ref = createEnergyGoalRef(createEnergyGoalVars);
// Variables can be defined inline as well.
const ref = createEnergyGoalRef({ name: ..., period: ..., startDate: ..., targetValue: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEnergyGoalRef(dataConnect, createEnergyGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.energyGoal_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.energyGoal_insert);
});
```

