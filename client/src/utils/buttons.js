  import {
  activeOL,
  allOL,
  getSigSets,
  createOL,
  createSigSet,
  checkRev,
  createRevisedOL,
  updateOL,
  getOneOL,
} from "./limits";
  
  const makeOL = async ({ setSelOpLimit, setSigSet })=> {
    let id;
    await createOL().then((data) => {
      setSelOpLimit(data.data);
      id = data.data.id;
    });
    await createSigSet(id).then((data) => {
      setSigSet(data.data);
    });
  }

export {
    makeOL

};