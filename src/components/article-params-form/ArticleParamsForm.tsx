import { clsx } from 'clsx';
import { useState, useRef, useEffect } from 'react';
import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

import type { ArticleStateType, OptionType } from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  articleState: ArticleStateType;
  onApply: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  articleState,
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<ArticleStateType>(articleState);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return (): void => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleChange =
    (field: keyof ArticleStateType): ((option: OptionType) => void) =>
    (option: OptionType): void => {
      setFormState((prev) => ({ ...prev, [field]: option }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <div ref={rootRef}>
      <ArrowButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      <aside className={clsx(styles.container, isOpen && styles.container_open)}>
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            title="Шрифт"
            selected={formState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={handleChange('fontFamilyOption')}
          />
          <RadioGroup
            name="fontSize"
            title="Размер шрифта"
            selected={formState.fontSizeOption}
            options={fontSizeOptions}
            onChange={handleChange('fontSizeOption')}
          />
          <Select
            title="Цвет шрифта"
            selected={formState.fontColor}
            options={fontColors}
            onChange={handleChange('fontColor')}
          />
          <Select
            title="Цвет фона"
            selected={formState.backgroundColor}
            options={backgroundColors}
            onChange={handleChange('backgroundColor')}
          />
          <Select
            title="Ширина контента"
            selected={formState.contentWidth}
            options={contentWidthArr}
            onChange={handleChange('contentWidth')}
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
