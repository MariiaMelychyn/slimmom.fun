import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import DateForm from '../../components/DateForm';
import DiaryAddProductForm from '../../components/DiaryAddProductForm';
import RightSideBar from '../../components/RightSideBar';
import DiaryProductsList from '../../components/DiaryProductsList';
import Button from '../../components/Button';
import AddIcon from '@material-ui/icons/Add';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Loader from '../../components/Loader';

import { getUserInfo } from '../../redux/user/user_operation';
import { getNotAllowedProductsAll } from '../../redux/user/user_selector';
import {
  getKcalLeft,
  getKcalConsumed,
  getDailyRate,
  getPercentsOfDailyRate,
  date,
  getLoading,
} from '../../redux/day/day_selector';

import { motivation } from '../../utils/motivation';
import styles from './DiaryPage.module.css';

const DiaryPage = () => {
  const dispatch = useDispatch();

  const kcalLeft = useSelector(getKcalLeft);
  const kcalConsumed = useSelector(getKcalConsumed);
  const dailyRate = useSelector(getDailyRate);
  const percentsOfDailyRate = useSelector(getPercentsOfDailyRate);
  const notAllowedProductsAll = useSelector(getNotAllowedProductsAll);

  const today = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split('T')[0]; // Текущий день локально с учётом временных зон
  const currentDate = useSelector(date); // Текущий день из базы

  const isLoading = useSelector(getLoading); // Селектор статуса загрузки

  const [mobileFormIsVisible, setMobileFormIsVisible] = useState(false);
  const handleClick = () => {
    setMobileFormIsVisible(prev => !prev);
  };

  useEffect(() => {
    document.title = 'Дневник | SlimMom';
    dispatch(getUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (kcalLeft < 0 && currentDate === today) {
      toast.warn(
        `🐷 ${motivation[Math.floor(Math.random() * motivation.length)]}`,
      );
    }
  }, [kcalLeft, today, currentDate]); // Вызывается два раза после калькулятора, нужно поправить

  return (
    <>
      <Header coloredBg />
      <div className={styles.flexBox}>
        {!mobileFormIsVisible ? (
          <>
            <div className={styles.exampleBox}>
              <DateForm />
              <div className={styles.isHidddenMobile}>
                <DiaryAddProductForm />
              </div>

              <DiaryProductsList />
              <div className={styles.isHidddenTablet}>
                <Button
                  customType="primary"
                  className="small"
                  onClick={handleClick}
                  disabled={currentDate !== today}
                >
                  <AddIcon />
                </Button>
              </div>
              {!dailyRate ? (
                <h3 className={styles.notification}>
                  Чтобы добавить продукты в список - заполните форму на странице
                  Калькулятора
                </h3>
              ) : (
                ''
              )}
            </div>
            <RightSideBar
              kcalLeft={kcalLeft}
              kcalConsumed={kcalConsumed}
              dailyRate={dailyRate}
              percentsOfDailyRate={percentsOfDailyRate}
              notAllowedProductsAll={notAllowedProductsAll}
            />
          </>
        ) : (
          <>
            <div className={styles.exampleBox}>
              <DiaryAddProductForm />
              <KeyboardBackspaceIcon
                className={styles.backButton}
                onClick={handleClick}
              />
            </div>
          </>
        )}
      </div>

      {isLoading && <Loader />}
    </>
  );
};

export default DiaryPage;
