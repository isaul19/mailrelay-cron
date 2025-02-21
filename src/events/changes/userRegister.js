const { changePersonStatus } = require("../../controllers/statusPersonController");
const { assignSpecialService } = require("../../controllers/operationController");
const {
  updateNaturalPerson,
  insertNaturalPerson,
} = require("../../controllers/naturalPersonController");
const { updateLegalPerson, insertLegalPerson } = require("../../controllers/legalPersonController");

const userChangeFunction = async (user) => {
  if (user.trigger === "userRegister") {
    if (user?.level === "30") {
      await insertNaturalPerson(user);
    } else {
      await insertLegalPerson(user);
    }
  } else {
    if (user?.is_active !== undefined || user?.content_promo !== undefined) {
      await changePersonStatus(user);
    }

    if (user?.special_service !== undefined) {
      await assignSpecialService(user);
    }

    if (user?.level === "30") {
      await updateNaturalPerson(user);
    } else if (!user?.level) {
      await updateLegalPerson(user);
    }
  }
};

exports.userChangeFunction = userChangeFunction;
