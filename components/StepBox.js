"use client";
import Link from "next/link";
import styles from "@/styles/MemberPage.module.css"; // CSS module for styles

const StepBox = ({
  step,
  status,
  isCreator,
  clubId,
  stepName,
  onStatusChange,
}) => {
  const handleStatusChange = (action) => {
    onStatusChange(stepName, action);
  };

  // Determine color based on status
  let boxColor;
  if (status === "not started") {
    boxColor = styles.notStarted;
  } else if (status === "finished") {
    boxColor = styles.finished;
  } else if (status === "in progress") {
    boxColor = styles.inProgress;
  }

  return (
    <div className={`${styles.stepBox} ${boxColor}`}>
      <h3>
        <span className={styles.stepName}>{step}</span>
      </h3>
      <p>{status}</p>
      {status === "in progress" && (
        <Link href={`/clubs/${clubId}/voting/${stepName}`}>
          <button className={styles.voteButton}>Vote</button>
        </Link>
      )}
      {isCreator && (
        <>
          {status === "in progress" && (
            <button
              className={`${styles.buttonFinish} ${styles.voteButton}`}
              onClick={() => handleStatusChange("finish")}
            >
              Finish the Vote
            </button>
          )}
          {status === "not started" && (
            <button
              className={styles.buttonStart}
              onClick={() => handleStatusChange("start")}
            >
              Open the Vote
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default StepBox;
