import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import { useMyState } from 'helpers/hooks';

Top30Modal.propTypes = {
  onHide: PropTypes.func.isRequired,
  month: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  year: PropTypes.string.isRequired
};

export default function Top30Modal({ onHide, month, year, users }) {
  const { userId } = useMyState();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  return (
    <Modal small closeWhenClickedOutside={false} onHide={onHide}>
      <header>{`${month} ${year}`}</header>
      <main style={{ paddingTop: 0 }}>
        <RoundList style={{ marginTop: 0 }}>
          {users.map((user) => (
            <RankingsListItem key={user.id} user={user} myId={userId} />
          ))}
        </RoundList>
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
