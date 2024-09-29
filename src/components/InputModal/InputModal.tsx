import { useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useUpdateHabitName } from "../../hooks/useUpdateHabitName";
import "./InputModal.css";

export const InputModal = ({
  habitName,
  setShowModal,
  dataToUpdate,
  id,
}: {
  habitName: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dataToUpdate: string;
  id: string;
}) => {
  const [newHabitName, setNewHabitName] = useState<string>(habitName);
  const { updateHabitName } = useUpdateHabitName();
  const navigate = useNavigate();

  const handleSubmitHabitNameChange = async (
    event: ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    updateHabitName(id, newHabitName);
    setShowModal(false);
    const currentPathname = location.pathname;

    if (currentPathname.includes(habitName.split(" ")[0])) {
      navigate(`/habits/${newHabitName}`);
    }
  };

  return (
    <>
      <div className="whole-page">
        <div className="modal-container">
          <div className="modal-title-and-close-button">
            <h2 className="modal-title">Update {dataToUpdate}</h2>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <form onSubmit={handleSubmitHabitNameChange} className="modal-form">
            <div className="label-and-input-container">
              <label className="modal-input-label">
                Type below and press confirm to update the{" "}
                <span className="modal-prompt-span">{dataToUpdate}</span>.
              </label>
              <div className="input-text-and-confirm-button">
                <input
                  type="text"
                  placeholder="New habit name here..."
                  className="modal-input"
                  defaultValue={habitName}
                  autoFocus
                  onFocus={(event) => event.target.select()}
                  value={newHabitName}
                  onChange={(event) => {
                    setNewHabitName(event.target.value);
                  }}
                />
                <button className="confirm-input-button">
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
