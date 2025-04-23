import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Pressable,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import ListSocialLink from "@/components/detail/ListSoialLink";
import {
  getTokenDetail,
  getTokenDetailFromCoinGecko,
  getTokenSecurity,
} from "@/api/token";
import { router, useLocalSearchParams } from "expo-router";
import { ApiResponseTokenSecurity, TokenDetail } from "@/types/tokenType";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import Selector from "@/components/Selector";
import IconFaceID from "@/assets/svgComponents/IconFaceID";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getName } from "@/utils/getNameCrypto";
import formatNumber, {
  formatCurrency,
  formatPrice,
} from "@/utils/formatCurrency";
import ErrorComponent from "@/components/detail/Error";
import SuccessComponent from "@/components/detail/Success";
import CustomImage from "@/components/ImageCustomer";
import { LinearGradient } from "expo-linear-gradient";
import { randomColor } from "@/utils/randomcolor";
import { useTokenImagePath } from "@/hooks/useGetImageToken";
import { fromNow } from "@/utils/Date";
import { LIST_LINK } from "@/constants/ListNetwork";
import RenderPrice from "@/components/ui/RenderPrice";
import {
  addFavorite,
  removeFavorite,
  saveFavorites,
  selectFavorites,
} from "@/store/favoriteSlice";
import DefaultLogo from "@/components/ui/DefaulfLogo";
import { renderChangePrice } from "@/utils/cryptoUtils";
import PriceChange from "@/components/ui/PriceChange";
import TradingViewChart from "@/components/detail/TradingViewChart";
import IframeChart from "@/components/detail/IframeChart";

export default function DetailToken() {
  const { pair_address, chainId, token_address } = useLocalSearchParams<{
    pair_address: string;
    chainId: string;
    token_address: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();

  const ethereumAccounts = useSelector(
    (state: RootState) => state.ethereum.addresses
  );
  const solanaAccounts = useSelector(
    (state: RootState) => state.solana.addresses
  );

  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.some(
    (fav) => fav.token_address === token_address && fav.chain_id === chainId
  );

  const [selectedOption, setSelectedOption] = useState(ethereumAccounts[0]);

  const [tokenDetail, setTokenDetail] = useState<TokenDetail>();
  const [tokenSercurity, setTokenSercurity] =
    useState<ApiResponseTokenSecurity>();
  const [loading, setLoading] = useState<boolean>(true);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [paySellStatus, setPaySellStatus] = useState({
    loading: false,
    error: false,
    success: false,
    isBuy: true,
  });

  const [amount, setAmount] = useState<string>("0");

  const fetchDetailToken = async () => {
    if (!token_address || !chainId) {
      console.error("pair_address or chainId is missing:", {
        pair_address,
        chainId,
      });
      //   router.push('/+not-found');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getTokenDetail({ token_address, chainId });
      if (!data) {
        throw new Error("No data returned from getTokenDetail");
      }
      setTokenDetail({
        ...data,
        baseToken: {
          ...data.baseToken,
          symbol: data.baseToken.symbol.toLocaleUpperCase().trim(),
        },
      });
    } catch (error) {
      console.warn("Failed to fetch token detail from primary source:", error);
      try {
        const data = await getTokenDetailFromCoinGecko({
          token_address,
          chainId,
        });

        if (!data) {
          throw new Error("No data returned from getTokenDetailFromCoinGecko");
        }
        setTokenDetail(data);
      } catch (error) {
        console.error("Failed to fetch token detail from CoinGecko:", error);
        // router.push('/+not-found');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailToken();
  }, [pair_address, chainId]);

  const chainFromSecurityScan = useMemo(() => {
    if (tokenDetail != null) {
      return LIST_LINK.find(
        (item) => item.name.toLocaleLowerCase() === tokenDetail?.chainId
      )?.chain;
    }
  }, [tokenDetail]);

  const fetchTokenSercurity = async () => {
    try {
      const data = await getTokenSecurity(
        String(tokenDetail?.baseToken.address),
        String(chainFromSecurityScan)
      );

      if (data) {
        setTokenSercurity(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tokenDetail?.baseToken.address && chainFromSecurityScan) {
      fetchTokenSercurity();
    }
  }, [tokenDetail?.baseToken.address, chainFromSecurityScan]);

  const resultDataSecurity = useMemo(() => {
    if (tokenSercurity?.result && tokenDetail?.baseToken.address) {
      return tokenSercurity?.result[
        String(tokenDetail?.baseToken.address).toLowerCase()
      ];
    }
  }, [tokenSercurity?.result, tokenDetail?.baseToken.address]);

  const handleOpenBottomSheet = (value: boolean) => {
    if (!isBottomSheetOpen) {
      setPaySellStatus({
        error: false,
        loading: false,
        success: false,
        isBuy: value,
      });
      bottomSheetRef.current?.expand();
      setIsBottomSheetOpen(true);
    }
  };

  const handleCloseBottomSheet = useCallback(() => {
    if (isBottomSheetOpen) {
      bottomSheetRef.current?.close();
      setIsBottomSheetOpen(false);
    }
  }, [isBottomSheetOpen]);

  const calculatedAmount = useMemo((): number => {
    const amountNumber = parseFloat(amount);
    const price = parseFloat(tokenDetail?.priceNative || "0");
    return amountNumber * price;
  }, [amount, tokenDetail?.priceNative]);

  // validation amount
  const onchangAmout = (text: string) => {
    if (parseFloat(text) < 0 || isNaN(parseFloat(text))) {
      setAmount("0");
    } else {
      setAmount(text);
    }
  };

  const tryAgain = useCallback(() => {
    setPaySellStatus({
      ...paySellStatus,
      error: false,
    });
  }, [paySellStatus]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const { path, isLoading, error } = useTokenImagePath({
    chain: tokenDetail?.chainId,
    address: tokenDetail?.baseToken.address,
  });

  const TotalSupply = useMemo(() => {
    if (tokenDetail) {
      return tokenDetail.marketCap / Number(tokenDetail.priceUsd);
    }
  }, [tokenDetail]);

  const toggleFavorite = () => {
    if (isFavorite) {
      console.log("remove");
      dispatch(removeFavorite({ token_address, chain_id: chainId }));
    } else {
      console.log("add");
      dispatch(addFavorite({ token_address, chain_id: chainId }));
    }
  };

  useEffect(() => {
    dispatch(saveFavorites(favorites));
  }, [favorites]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={25} />
      </View>
    );
  }

  if (!loading && tokenDetail)
    return (
      <SafeAreaView style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent /> */}

        {/* Header */}
        <Header
          iconRight={
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? "#ffc802" : "#000"}
              onPress={toggleFavorite}
            />
          }
        />

        {/* Main Content */}
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        >
          {/* Token Info */}
          <View style={styles.tokenInfo}>
            <View style={styles.tokenRow}>
              {path ? (
                <CustomImage
                  source={path}
                  size={35}
                  width={35}
                  height={35}
                  style={{ marginRight: 10 }}
                />
              ) : (
                <DefaultLogo symbol={tokenDetail.baseToken.symbol} />
              )}
              <View>
                <Text style={styles.name}>{tokenDetail.baseToken.symbol}</Text>
                <Text style={styles.fullName}>
                  {tokenDetail.baseToken.name}
                </Text>
              </View>
            </View>
            <View style={styles.priceInfo}>
              {tokenDetail.priceUsd == "0" ? (
                <Text style={styles.price}>$0</Text>
              ) : (
                <RenderPrice price={tokenDetail.priceUsd} />
              )}
              <PriceChange change={tokenDetail.priceChange.h24 ?? 0} />
            </View>
          </View>

          {/* Market Stats */}
          <View style={styles.marketStats}>
            {[
              {
                title: "Market Cap",
                value: tokenDetail?.marketCap ?? tokenDetail?.fdv,
              },
              { title: "Volume", value: tokenDetail?.volume?.h24 ?? 0 },
              { title: "Liquidity", value: tokenDetail?.liquidity?.usd ?? 0 },
            ].map((item, index) => (
              <View style={styles.stat} key={index}>
                <Text style={styles.statTitle}>{item.title}</Text>
                <Text style={styles.statValue}>{formatNumber(item.value)}</Text>
              </View>
            ))}
          </View>

          {/* Chart */}
          <IframeChart chainId={chainId} pairAddress={pair_address} />
          {/* Balance Section */}
          <View style={{ position: "relative", width: "100%", height: 60 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: -40,
                left: 0,
              }}
            >
              <View style={styles.balanceSection}>
                <View style={styles.balanceDetails}>
                  <Text style={styles.balanceTitle}>Your balance</Text>
                  <View style={styles.balanceRow}>
                    {path ? (
                      <CustomImage
                        source={path}
                        size={30}
                        width={30}
                        height={30}
                        style={{ marginRight: 10 }}
                      />
                    ) : (
                      <DefaultLogo symbol={tokenDetail.baseToken.symbol} />
                    )}
                    <Text style={styles.balanceAmount}>{mockData.balance}</Text>
                  </View>
                </View>
                <Text style={styles.balanceValue}>{mockData.balanceValue}</Text>
              </View>
            </View>
          </View>
          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>{mockData.description}</Text>
            <View style={styles.aboutDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.icon}>🌱</Text>
                <View>
                  <Text style={styles.detailValue}>
                    {fromNow(tokenDetail.pairCreatedAt ?? "")}
                  </Text>
                  <Text style={styles.detailLabel}>Created</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.icon}>🗓️</Text>
                <View>
                  <Text style={styles.detailValue}>
                    {TotalSupply
                      ? `${
                          TotalSupply > 49999
                            ? formatNumber(Number(TotalSupply.toFixed(0)), 2)
                            : formatPrice(TotalSupply)
                        }`
                      : "N/A"}
                  </Text>
                  <Text style={styles.detailLabel}>Total Supply</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.icon}>🧑</Text>
                <View>
                  <Text style={styles.detailValue}>
                    {resultDataSecurity?.holder_count
                      ? `${
                          Number(resultDataSecurity?.holder_count) > 49999
                            ? formatNumber(
                                Number(resultDataSecurity?.holder_count),
                                1
                              )
                            : formatPrice(
                                Number(resultDataSecurity?.holder_count)
                              )
                        }`
                      : "N/A"}
                  </Text>
                  <Text style={styles.detailLabel}>Holders</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <ListSocialLink
              contract={
                tokenDetail?.info?.websites?.find(
                  (site) => site.label === "Contract"
                )?.url
              }
              website={
                tokenDetail?.info?.websites?.find(
                  (site) => site.label === "Website"
                )?.url
              }
              twitter={
                tokenDetail?.info?.socials?.find(
                  (social) => social.type === "twitter"
                )?.url
              }
              telegram={
                tokenDetail?.info?.socials?.find(
                  (social) => social.type === "telegram"
                )?.url
              }
              reddit={
                tokenDetail?.info?.websites?.find(
                  (social) => social.label === "Reddit"
                )?.url
              }
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            label="Buy"
            onPress={() => handleOpenBottomSheet(true)}
            containerStyles={{ backgroundColor: "#269D65" }}
            icon={
              <Ionicons name="arrow-up-outline" size={20} color={"white"} />
            }
          />
          <Button
            label="Sell"
            onPress={() => handleOpenBottomSheet(false)}
            containerStyles={{ backgroundColor: "#DE4444" }}
            icon={
              <Ionicons name="arrow-down-outline" size={20} color={"white"} />
            }
          />
        </View>

        {/* PAY OR SELL */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setIsBottomSheetOpen(false)}
          overDragResistanceFactor={0}
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.bottomSheetContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, alignItems: "center", width: "100%" }}
            >
              {/* Header */}
              {!paySellStatus.success && !paySellStatus.error && (
                <View style={styles.headerContainer}>
                  <Pressable
                    style={[styles.hiddenBottomSheet, styles.center]}
                    onPress={handleCloseBottomSheet}
                  >
                    <Ionicons
                      name="chevron-back-outline"
                      size={20}
                      color="#000"
                    />
                  </Pressable>
                  <Text style={styles.headerText}>
                    {paySellStatus.isBuy ? "Buy" : "Sell"}
                  </Text>
                  <View style={styles.placeholder} />
                </View>
              )}

              {/* Error */}
              {paySellStatus.error && (
                <ErrorComponent
                  title="You've failed"
                  description="Your transaction is failded"
                  onRetry={tryAgain}
                  onClose={handleCloseBottomSheet}
                />
              )}

              {/* Success */}
              {paySellStatus.success && (
                <SuccessComponent
                  onClose={handleCloseBottomSheet}
                  onViewTransaction={tryAgain}
                  description="3,021.00 DAI to 2000 DOGE, purchased coins you will find in a new pocket"
                  title="You've bought!"
                />
              )}

              {/* Content */}
              {!paySellStatus.success && !paySellStatus.error && (
                <>
                  <View
                    style={[
                      styles.contentContainer,
                      ,
                      {
                        flexDirection: !paySellStatus.isBuy
                          ? "column-reverse"
                          : "column",
                      },
                    ]}
                  >
                    {/* Selector Box */}
                    <View style={styles.selectorBox}>
                      <View style={styles.selectorLeft}>
                        <Selector
                          options={[...ethereumAccounts, ...solanaAccounts]}
                          selectedOption={selectedOption}
                          setSelectedOption={setSelectedOption}
                        />
                        <Text style={styles.balanceText}>
                          Balance:
                          {`${selectedOption.balance} ${getName(
                            selectedOption.type
                          )}`}
                        </Text>
                      </View>

                      <View style={styles.selectorRight}>
                        {paySellStatus.isBuy ? (
                          <TextInput
                            value={amount}
                            style={[styles.amountText, { color: "black" }]}
                            keyboardType="numeric"
                            onChangeText={(text) => onchangAmout(text)}
                          />
                        ) : (
                          <Text style={styles.amountText}>
                            {formatCurrency(calculatedAmount, 6, 0)}
                          </Text>
                        )}
                        <Text style={styles.priceText}>$499.749</Text>
                      </View>
                    </View>

                    {/* Swap Arrow */}
                    <View style={[styles.swapArrow, styles.center]}>
                      <Ionicons name="arrow-down-outline" size={20} />
                    </View>

                    {/* Selector Box (Duplicate) */}
                    <View style={styles.selectorBox}>
                      <View style={styles.selectorLeft}>
                        <TouchableOpacity
                          style={[styles.chipBuy, styles.center]}
                        >
                          {/* Icon */}
                          <CustomImage
                            source={tokenDetail?.info?.imageUrl}
                            size={25}
                            width={25}
                            height={25}
                            style={{ marginRight: 10 }}
                            boxShadow={false}
                          />
                          <Text style={styles.textBuy}>
                            {tokenDetail.baseToken.symbol}
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.balanceText}>
                          Balance: 0 {tokenDetail.baseToken.symbol}
                        </Text>
                      </View>
                      <View style={styles.selectorRight}>
                        {!paySellStatus.isBuy ? (
                          <TextInput
                            value={amount}
                            style={[styles.amountText, { color: "black" }]}
                            keyboardType="numeric"
                            onChangeText={(text) => onchangAmout(text)}
                          />
                        ) : (
                          <Text style={styles.amountText}>
                            {formatCurrency(calculatedAmount, 6, 0)}
                          </Text>
                        )}
                        <Text style={styles.priceText}>$499.749</Text>
                      </View>
                    </View>
                  </View>
                  <Button
                    icon={<IconFaceID size={25} color="white" />}
                    label="Swipe to swap"
                    containerStyles={{
                      width: "90%",
                      position: "absolute",
                      bottom: 20,
                      margin: "auto",
                    }}
                    onPress={
                      paySellStatus.isBuy
                        ? () => {
                            setPaySellStatus({
                              ...paySellStatus,
                              error: true,
                            });
                          }
                        : () => {
                            setPaySellStatus({
                              ...paySellStatus,
                              success: true,
                            });
                          }
                    }
                  />
                </>
              )}

              {keyboardHeight > 0 && (
                <View
                  style={[styles.buttonContainer, { bottom: keyboardHeight }]}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      Keyboard.dismiss();
                      setKeyboardHeight(0);
                    }}
                  >
                    <Ionicons name="chevron-down" size={20} color={"black"} />
                  </TouchableOpacity>
                </View>
              )}
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    );

  if (!tokenDetail) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.aboutTitle}>404 NOT FOUND</Text>
        <Text onPress={() => router.back()}>Back</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    paddingBottom: 80,
    alignItems: "center",
    width: "100%",
  },
  tokenInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    width: "90%",
  },
  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textLogo: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#fff",
  },
  smallLogo: {
    width: 30,
    height: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    width: "auto",
  },
  fullName: {
    fontSize: 12,
    color: "#888",
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },

  priceChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  change: {
    fontSize: 14,
  },
  marketStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    width: "90%",
  },
  stat: {
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    color: "#888",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginVertical: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 10px 4px #0000000D",
    width: "90%",
  },
  balanceDetails: {
    flex: 1,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceValue: {
    fontSize: 16,
    color: "#888",
  },
  aboutSection: {
    marginVertical: 16,
    width: "90%",
    margin: "auto",
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  aboutDetails: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // bottom sheet
  // Reusable styles
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // BottomSheet styles
  bottomSheetBackground: {
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: "center",
  },

  // Header styles
  headerContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hiddenBottomSheet: {
    width: 40,
    height: 40,
    boxShadow: "0px 6px 16px 0px #2B2D3314",
    borderRadius: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },

  // Content styles
  contentContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
    height: 210,
    justifyContent: "space-between",
  },
  selectorBox: {
    width: "90%",
    height: 100,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    backgroundColor: "#F4F5F7",
    borderColor: "#E5E5E5",
  },
  selectorLeft: {
    justifyContent: "space-between",
    height: "100%",
    alignItems: "flex-start",
  },
  selectorRight: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
  },
  balanceText: {
    color: "#A9AAB2",
    fontWeight: "500",
    fontSize: 14,
  },
  amountText: {
    color: "#A9AAB2",
    fontWeight: "600",
    fontSize: 28,
  },
  priceText: {
    color: "#A9AAB2",
    fontWeight: "500",
    fontSize: 14,
  },

  // Arrow styles
  swapArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#F2F3F5",
    position: "absolute",
    top: 210 / 2 - 15, // Position in the middle between two selector boxes
    zIndex: 3,
  },

  //
  chipBuy: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    paddingVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    width: "72%",
    paddingHorizontal: 10,
  },
  iconBuyContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    // overflow: 'hidden',
    boxShadow: "0px 10px 24px 0px #4d4d4d33",
  },
  iconBuy: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  textBuy: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  fallbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  // keyboard
  buttonContainer: {
    position: "absolute",
  },
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 15,
    alignItems: "center",
    boxShadow: "0px 6px 16px 0px #00000013",
  },
});

// Mock data (Replace with actual data from API if needed)
const mockData = {
  logo: "https://dd.dexscreener.com/ds-data/tokens/solana/GJAFwWjJ3vnTsrQVabjBVK2TYB1YtRCQXRDfDgUnpump.png?key=1aece6",
  name: "DOGE",
  fullName: "Dogecoin",
  price: "$0.00435",
  change: "1.56%",
  marketCap: "$300.5M",
  volume: "$24.5M",
  liquidity: "$500K",
  balance: "21.246 DOGE",
  balanceValue: "$351.91",
  description:
    "The aggressive growth strategy allows you to earn 158% per annum, but with a high risk. Our analysts have balanced the strategy with different assets so that the strategy pays off within the recommended time frame.",
  createdAt: "1m 10d ago",
  totalSupply: "1B",
  holders: "1,982",
};
