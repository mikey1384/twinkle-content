import { buildPropsObj } from './utils';
export default function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_CODE':
      return {
        ...state,
        code: action.payload,
        codeNoRecompile: ''
      };
    case 'UPDATE_CODE_AND_PROVIDER':
      return {
        ...state,
        code: action.payload.code,
        providerValue: action.payload.providerValue,
        codeNoRecompile: ''
      };
    case 'UPDATE':
      return {
        ...state,
        code: action.payload.code,
        providerValue: action.payload.providerValue,
        codeNoRecompile: '',
        props: buildPropsObj(state.props, action.payload.updatedPropValues)
      };
    case 'UPDATE_PROPS_AND_CODE_NO_RECOMPILE':
      return {
        ...state,
        codeNoRecompile: action.payload.codeNoRecompile,
        props: buildPropsObj(state.props, action.payload.updatedPropValues)
      };
    case 'UPDATE_PROPS':
      return {
        ...state,
        codeNoRecompile: '',
        props: buildPropsObj(state.props, action.payload)
      };
    case 'UPDATE_PROPS_AND_CODE':
      return {
        ...state,
        code: action.payload.code,
        codeNoRecompile: '',
        props: buildPropsObj(state.props, action.payload.updatedPropValues)
      };
    case 'RESET':
      return {
        ...state,
        code: action.payload.code,
        codeNoRecompile: '',
        props: action.payload.props,
        providerValue: action.payload.providerValue
      };
    default:
      return state;
  }
}
