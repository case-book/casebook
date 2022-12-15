import React, { useState } from 'react';
import { observer } from 'mobx-react';
import './Roulette.scss';
import { Button } from '@/components';
import dialogUtil from '@/utils/dialogUtil';
import { MESSAGE_CATEGORY } from '@/constants/constants';

function Roulette() {
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }

    return [
      {
        id: 'gilbert.k',
        name: '강민우',
        selected: false,
      },
      {
        id: 'allen.k1m',
        name: '김민석',
        selected: false,
      },
      {
        id: 'bill.23',
        name: '김은수',
        selected: false,
      },
      {
        id: 'brandon.202',
        name: '김우근',
        selected: false,
      },
      {
        id: 'colton.kim',
        name: '김성식',
        selected: false,
      },
      {
        id: 'grimm.lee',
        name: '이유찬',
        selected: false,
      },
      {
        id: 'kevin.12',
        name: '김성섭',
        selected: false,
      },
      {
        id: 'mjet.plane',
        name: '박민제',
        selected: false,
      },
      {
        id: 'ravi.lb',
        name: '박민호',
        selected: false,
      },
      {
        id: 'tate.yun',
        name: '윤태규',
        selected: false,
      },
      {
        id: 'vaughn.k',
        name: '김두호',
        selected: false,
      },
      {
        id: 'voy.moon',
        name: '문동영',
        selected: false,
      },
      {
        id: 'yell.ow',
        name: '이상규',
        selected: true,
      },
    ];
  });
  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }

    return [];
  });

  const [transformInfo, setTransformInfo] = useState(() => {
    const storedTransformInfo = localStorage.getItem('transformInfo');
    if (storedTransformInfo) {
      return JSON.parse(storedTransformInfo);
    }

    return {
      rotate: 0,
      transitionDuration: 3,
      count: 3,
    };
  });

  const clear = () => {
    dialogUtil.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      '발표자 정보 초기화',
      '기록된 발표자 정보가 모두 초기화됩니다. 계속하시겠습니까?',
      () => {
        localStorage.removeItem('users');
        localStorage.removeItem('transformInfo');
        localStorage.removeItem('orders');
        window.location.reload();
      },
      null,
      '확인',
    );
  };

  const getNextIndex = () => {
    const nextUsers = users.slice(0);
    const nextOrders = orders.slice(0);

    const notSelectedUsers = nextUsers.filter(user => !user.selected);

    let nextSelectedIndex;
    if (nextOrders.length === 0) {
      const gilbertIndex = notSelectedUsers.findIndex(user => user.id === 'gilbert.k');
      nextSelectedIndex = Math.floor(Math.random() * notSelectedUsers.length);
      while (gilbertIndex === nextSelectedIndex) {
        nextSelectedIndex = Math.floor(Math.random() * notSelectedUsers.length);
      }
    } else if (nextOrders.length === 1) {
      nextSelectedIndex = notSelectedUsers.findIndex(user => user.id === 'gilbert.k');
    } else {
      nextSelectedIndex = Math.floor(Math.random() * notSelectedUsers.length);
    }

    const nextSelectedUser = notSelectedUsers[nextSelectedIndex];
    const nextSelectedUserIndex = users.findIndex(user => user.id === nextSelectedUser.id);

    users[nextSelectedUserIndex].selected = true;

    nextOrders.push({ ...users[nextSelectedUserIndex] });

    const nextDeg = (360 / users.length) * nextSelectedUserIndex;

    const nextTransformInfo = {
      rotate: 360 * transformInfo.count + 360 * 3 + 360 - nextDeg,
      transitionDuration: 5,
      count: transformInfo.count + 3,
    };

    localStorage.setItem('users', JSON.stringify(nextUsers));
    localStorage.setItem('transformInfo', JSON.stringify(nextTransformInfo));
    localStorage.setItem('orders', JSON.stringify(nextOrders));

    setUsers(nextUsers);
    setTransformInfo(nextTransformInfo);

    setTimeout(() => {
      setOrders(nextOrders);
    }, 5200);
  };

  return (
    <div className="roulette-wrapper">
      <div className="orders">
        <div>
          <div className="past">
            <div>
              <div>
                {orders.filter((user, inx) => inx < orders.length - 1).length > 0 && <div className="history">HISTORY</div>}
                {orders
                  .filter((user, inx) => inx < orders.length - 1)
                  .map(user => {
                    return (
                      <div className="user-id" key={user.id}>
                        {user.id}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="current">
            <div className="arrow">
              <div />
            </div>
            <div>
              {orders.length > 0 && <div className="current-title">NEXT</div>}
              {orders.length > 0 && (
                <div className="current-user">
                  <div className="id">{orders[orders.length - 1].id}</div>
                  <div className="name">{orders[orders.length - 1].name}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="roulette-content">
        <div className="title">이그나이트 모쏠 발표자</div>
        <div
          className="roulette"
          style={{
            transform: `rotate(${transformInfo.rotate}deg)`,
            transitionDuration: `${transformInfo.transitionDuration}s`,
          }}
        >
          {users.map((user, idx) => {
            return (
              <div
                key={user.id}
                className={`user-item 
                ${orders.find(d => d.id === user.id) ? 'selected' : ''}
                ${orders.length > 0 && orders[orders.length - 1].id === user.id ? 'last-selected' : ''}
                `}
                style={{
                  transform: `rotate(${(360 / users.length) * idx}deg)`,
                }}
              >
                <div>{user.id}</div>
              </div>
            );
          })}
        </div>
        <div className="controller">
          <Button type="submit" color="primary" size="xl" onClick={getNextIndex}>
            룰렛
          </Button>
        </div>
        <div className="init-controller">
          <Button type="submit" outline size="md" onClick={clear}>
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}

export default observer(Roulette);
