const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'ecovolt-frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createDemoUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDemoUser');
}
createDemoUserRef.operationName = 'CreateDemoUser';
exports.createDemoUserRef = createDemoUserRef;

exports.createDemoUser = function createDemoUser(dc) {
  return executeMutation(createDemoUserRef(dc));
};

const listEnergyReadingsForHomeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEnergyReadingsForHome', inputVars);
}
listEnergyReadingsForHomeRef.operationName = 'ListEnergyReadingsForHome';
exports.listEnergyReadingsForHomeRef = listEnergyReadingsForHomeRef;

exports.listEnergyReadingsForHome = function listEnergyReadingsForHome(dcOrVars, vars) {
  return executeQuery(listEnergyReadingsForHomeRef(dcOrVars, vars));
};

const createEnergyGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEnergyGoal', inputVars);
}
createEnergyGoalRef.operationName = 'CreateEnergyGoal';
exports.createEnergyGoalRef = createEnergyGoalRef;

exports.createEnergyGoal = function createEnergyGoal(dcOrVars, vars) {
  return executeMutation(createEnergyGoalRef(dcOrVars, vars));
};

const getHomeForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetHomeForUser');
}
getHomeForUserRef.operationName = 'GetHomeForUser';
exports.getHomeForUserRef = getHomeForUserRef;

exports.getHomeForUser = function getHomeForUser(dc) {
  return executeQuery(getHomeForUserRef(dc));
};
