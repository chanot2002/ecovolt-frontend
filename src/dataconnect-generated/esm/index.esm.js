import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'ecovolt-frontend',
  location: 'us-east4'
};

export const createDemoUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDemoUser');
}
createDemoUserRef.operationName = 'CreateDemoUser';

export function createDemoUser(dc) {
  return executeMutation(createDemoUserRef(dc));
}

export const listEnergyReadingsForHomeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEnergyReadingsForHome', inputVars);
}
listEnergyReadingsForHomeRef.operationName = 'ListEnergyReadingsForHome';

export function listEnergyReadingsForHome(dcOrVars, vars) {
  return executeQuery(listEnergyReadingsForHomeRef(dcOrVars, vars));
}

export const createEnergyGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEnergyGoal', inputVars);
}
createEnergyGoalRef.operationName = 'CreateEnergyGoal';

export function createEnergyGoal(dcOrVars, vars) {
  return executeMutation(createEnergyGoalRef(dcOrVars, vars));
}

export const getHomeForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetHomeForUser');
}
getHomeForUserRef.operationName = 'GetHomeForUser';

export function getHomeForUser(dc) {
  return executeQuery(getHomeForUserRef(dc));
}

