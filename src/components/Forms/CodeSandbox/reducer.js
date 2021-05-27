export default function reducer(state, action) {
  switch (action.type) {
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
