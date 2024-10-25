import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const AllComments = ({ route }) => {
    const [activeTab, setActiveTab] = useState('Comments');
    const { comments } = route.params;
    const sortedComments = comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    const [childComments, setChildComments] = useState(sortedComments);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showRatingOptions, setShowRatingOptions] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const bottomSheetRef = useRef(null);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);

    // Hàm xử lý lọc comments
    const handleFilterPress = (filter, rating = null) => {
        setSelectedFilter(filter); // Cập nhật filter khi bấm
        setSelectedRating(rating);

        if (filter === 'rating') {
            setShowRatingOptions(true);
            if (rating === null) {
                setChildComments(sortedComments)
            }
            else {
                const filteredComments = sortedComments.filter(comment => comment.rating === rating);
                setChildComments(filteredComments);
            }
            console.log(rating)
        } else {
            setChildComments(sortedComments);
            setShowRatingOptions(false);
            // Reset lại comments nếu chọn filter khác
        }
    };


    const getFilterStyle = (filter) => {
        return {
            borderWidth: 1,
            borderColor: selectedFilter === filter ? '#FF6347' : '#ccc', // Đổi màu khi được chọn
            backgroundColor: '#fff',
            borderRadius: 3,
            elevation: 2,
            alignItems: 'center',
            width: 128,
            flexDirection: 'column',
            paddingBottom: 5,
        };
    };
    const toggleReport = (id) => {
        setSelectedReportId((prevId) => (prevId === id ? null : id));
    };
    // Shared value for tab transition
    const transition = useSharedValue(0);

    // Update transition value based on the active tab
    useEffect(() => {
        transition.value = activeTab === 'Comments' ? 0 : 1; // 0 for Comments, 1 for Add Comment
    }, [activeTab]);

    const getFilterTextStyle = (filter) => ({
        fontSize: 14,
        color: selectedFilter === filter ? '#FF6347' : '#333', // Đổi màu thành cam nếu được chọn, đen nếu không
    });

    const getFilterCountStyle = (filter) => ({
        fontSize: 12,
        color: selectedFilter === filter ? '#FF6347' : '#333', // Đổi màu tương tự cho số lượng
    });

    // Animated styles for Comments and Add Comment
    const commentsStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(transition.value === 0 ? 1 : 0, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            }),
            transform: [
                {
                    translateX: withTiming(transition.value === 0 ? 0 : -100, {
                        duration: 300,
                        easing: Easing.inOut(Easing.ease),
                    }),
                },
            ],
        };
    });

    const addCommentStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(transition.value === 1 ? 1 : 0, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            }),
            transform: [
                {
                    translateX: withTiming(transition.value === 1 ? 0 : 100, {
                        duration: 300,
                        easing: Easing.inOut(Easing.ease),
                    }),
                },
            ],
        };
    });

    const renderBottomSheetContent = () => (
        <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Select Rating</Text>
            {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity key={rating} style={styles.ratingOption} onPress={() => handleFilterPress('rating', rating)}>
                    <Text style={styles.ratingText}>{rating} Star</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => {
        return (
            <View style={styles.commentContainer}>
                <Image source={{ uri: item.authorImage }} style={styles.commentAuthorImage} />
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.authorText}>{item.author}</Text>
                    <View style={styles.commentRating}>
                        {Array(item.rating).fill().map((_, index) => (
                            <Icon key={index} name="star" size={14} color="#FFD700" />
                        ))}
                    </View>
                    <Text style={styles.commentText}>{item.feedback}</Text>
                    <Text style={styles.commentDate}>
                        {`${new Date(item.date).toLocaleDateString('vi', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}`}
                    </Text>
                </View>
                <View style={styles.anotherOption}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => console.log('Like pressed')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon style={{ color: 'grey' }} name="thumbs-o-up" size={16} />
                            <Text style={styles.useful}>Useful</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Icon dấu ba chấm */}
                    <TouchableOpacity onPress={() => toggleReport(`${item.date}-${item.author}`)}>
                        <Icon style={{ color: 'grey' }} name="ellipsis-h" size={16} />
                    </TouchableOpacity>
                    {selectedReportId === `${item.date}-${item.author}` && (
                        <View style={{ position: 'absolute', right: 0, top: 30 }}>
                            <Text style={{ backgroundColor: 'black', padding: 7, borderRadius: 5, color: 'white' }}>
                                Report
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Comments' && styles.activeTab]}
                    onPress={() => setActiveTab('Comments')}
                >
                    <Text style={activeTab === 'Comments' ? styles.tabTextActive : styles.tabText}>Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Add Comment' && styles.activeTab]}
                    onPress={() => setActiveTab('Add Comment')}
                >
                    <Text style={activeTab === 'Add Comment' ? styles.tabTextActive : styles.tabText}>Add Comment</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.content}>
                <Animated.View style={commentsStyle}>
                    {activeTab === 'Comments' && (
                        <>
                            <View style={styles.filterContainer}>
                                <TouchableOpacity style={getFilterStyle('all')} onPress={() => handleFilterPress('all')}>
                                    <Text style={getFilterTextStyle('all')}>All</Text>
                                    <Text style={getFilterCountStyle('all')}>({childComments.length})</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={getFilterStyle('image')} onPress={() => handleFilterPress('image')}>
                                    <Text style={getFilterTextStyle('image')}>Image</Text>
                                    <Text style={getFilterCountStyle('image')}>({childComments.productImage || 0})</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={getFilterStyle('rating')} onPress={() => handleFilterPress('rating')}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={getFilterTextStyle('rating')}>Rating <Icon style={{ color: '#FFD700' }} name="star" size={16} /></Text>
                                    </View>
                                    <Text style={getFilterCountStyle('rating')}>(All)</Text>
                                </TouchableOpacity>

                            </View>
                            {showRatingOptions && (
                                <View style={styles.dropdown}>
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <TouchableOpacity key={rating} onPress={() => handleFilterPress('rating', rating)} style={styles.ratingRow}>
                                            {/* Hiển thị các ngôi sao dựa vào giá trị rating */}
                                            <Icon name={selectedRating === rating ? 'dot-circle-o' : 'circle-o'} size={20} color={selectedRating === rating ? '#FF6347' : '#000'} style={styles.radio} />
                                            {[...Array(rating)].map((_, i) => (
                                                <Icon key={i} name="star" size={20} color="gold" style={styles.starIcon} />
                                            ))}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <View style={styles.separator} />
                            <FlatList
                                data={childComments}
                                renderItem={renderItem}
                                keyExtractor={(item) => `${item.date}-${item.author}`}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                            <Text style={styles.testText}>There is no more comment</Text>
                            <BottomSheet
                                ref={bottomSheetRef}
                                onChange={handleSheetChanges}
                                snapPoints={['5%', '5%', '55%']}
                                index={-1}
                                enablePanDownToClose={true}
                            >
                                <BottomSheetView style={styles.contentContainer}>
                                    {renderBottomSheetContent()}
                                </BottomSheetView>
                            </BottomSheet>
                        </>
                    )}
                </Animated.View>

                <Animated.View style={addCommentStyle}>
                    {activeTab === 'Add Comment' && (
                        <View style={styles.addCommentContainer}>
                            <Text style={styles.addCommentText}>Add a Comment</Text>
                            {/* Thêm các thành phần để thêm bình luận tại đây */}
                        </View>
                    )}
                </Animated.View>
            </View>
        </GestureHandlerRootView>
    );
};

export default AllComments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 15,
    },
    tab: {
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        paddingBottom: 10,
        paddingHorizontal: 50,
    },
    activeTab: {
        borderBottomColor: '#FF6347',
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    tabTextActive: {
        fontSize: 16,
        color: '#FF6347',
    },
    filterText: {
        fontSize: 14,
        color: '#FF6347',
    },
    filterCount: {
        fontSize: 12,
        color: '#FF6347',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        width: '100%',
        marginVertical: 10,
    },
    commentContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    commentAuthorImage: {
        width: 30,
        height: 30,
        borderRadius: 15, // Chỉnh lại để hình tròn
        marginRight: 10,
    },
    authorText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    commentRating: {
        flexDirection: 'row',
        marginTop: 5,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '400',
        marginBottom: 5,
        marginTop: 2,
    },
    commentDate: {
        fontSize: 12,
        color: '#666',
    },
    addCommentContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    addCommentText: {
        fontSize: 16,
        color: '#333',
    },
    testText: {
        textAlign: 'center',
        color: '#FF6347',
    },
    content: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 4
    },
    filterButton: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    anotherOption: {
        position: 'absolute',
        right: 20,
        top: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    useful: {
        marginLeft: 5,
        fontSize: 13,
        color: 'grey'
    },
    dropdown: {
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 10
    },
    bottomSheetContent: {
        backgroundColor: '#fff',
        padding: 20,
        height: 250,
    },
    bottomSheetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ratingOption: {
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    closeButtonText: { color: '#fff', fontWeight: 'bold' },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    radio: {
        marginRight: 10,
    },
    starIcon: {
        marginRight: 5,
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
    selectedText: {
        fontSize: 16,
        color: 'blue',
        fontWeight: 'bold',
    },
});
